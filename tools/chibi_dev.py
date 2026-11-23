# Chibi "Val" mascot for zevbii.com, built by script (no generators).
#   blender -b -P tools/chibi_dev.py -- public/mascot/val.glb [preview.png]
# Faces -Y in Blender (= +Z toward the camera in three.js). Animated: idle bob + wave.
import bpy, bmesh, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "val.glb"
PREVIEW = argv[1] if len(argv) > 1 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.frame_start, scene.frame_end = 0, 72
scene.render.fps = 24


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1,)


def mat(name, hexc, rough=0.6, metal=0.0, alpha=1.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = lin(hexc)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if alpha < 1:
        b.inputs["Alpha"].default_value = alpha
        m.blend_method = "BLEND" if hasattr(m, "blend_method") else None
    return m


SKIN = mat("skin", "#4a2c1d", 0.55)
SKIN_D = mat("skin_dark", "#3a2216", 0.6)
HAIR = mat("hair", "#0d0b0a", 0.9)
TEE = mat("tee", "#15161a", 0.85)
JEANS = mat("jeans", "#2b3a55", 0.8)
SHOE = mat("shoe", "#f1efe9", 0.5)
SOLE = mat("sole", "#c9c4b8", 0.6)
FRAME = mat("frame", "#0a0a0c", 0.3)
LENS = mat("lens", "#ffffff", 0.05, 0.0, 0.06)
EYE = mat("eye", "#0b0807", 0.25)
WHITE = mat("eye_white", "#ffffff", 0.2)
LIP = mat("lip", "#7a3a2a", 0.45)
GOLD = mat("gold", "#d4a12a", 0.3, 0.8)
LAPTOP = mat("laptop", "#9aa1ad", 0.35, 0.7)
SCREEN = mat("screen", "#0e1116", 0.2)


def link(o, parent=None, m=None):
    if m:
        o.data.materials.clear()
        o.data.materials.append(m)
    if parent:
        o.parent = parent
    for p in o.data.polygons if hasattr(o.data, "polygons") else []:
        p.use_smooth = True
    return o


def sphere(name, loc, scale, m, parent=None, seg=32, ring=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = scale
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)
    return link(o, parent, m)


def capsule(name, a, b, r, m, parent=None):
    a, b = Vector(a), Vector(b)
    d = b - a
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=r, depth=d.length, location=(a + b) / 2)
    o = bpy.context.object
    o.name = name
    o.rotation_euler = d.to_track_quat("Z", "Y").to_euler()
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    link(o, None, m)
    for p in (a, b):
        s = sphere(name + "_cap", p, (r, r, r), m)
        bpy.ops.object.select_all(action="DESELECT")
        s.select_set(True)
        o.select_set(True)
        bpy.context.view_layer.objects.active = o
        bpy.ops.object.join()
    if parent:
        o.parent = parent
    return o


def rbox(name, loc, size, m, bevel=0.01, parent=None):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    md = o.modifiers.new("bev", "BEVEL")
    md.width = bevel
    md.segments = 4
    link(o, parent, m)
    for p in o.data.polygons:
        p.use_smooth = False
    return o


def empty(name, loc, parent=None):
    e = bpy.data.objects.new(name, None)
    scene.collection.objects.link(e)
    e.location = loc
    if parent:
        e.parent = parent
        e.location = Vector(loc) - parent.matrix_world.translation
    bpy.context.view_layer.update()
    return e


# ---------- rig of empties ----------
root = empty("val", (0, 0, 0))
body = empty("body", (0, 0, 0.30), root)
head_pivot = empty("head_pivot", (0, 0, 0.52), body)

HC = Vector((0, 0, 0.74))  # head centre
HR = 0.25


def parent_keep(o, p):
    bpy.context.view_layer.update()
    mw = o.matrix_world.copy()
    o.parent = p
    o.matrix_parent_inverse = p.matrix_world.inverted()
    o.matrix_world = mw


# ---------- head ----------
head = sphere("head", HC, (HR * 0.94, HR * 0.96, HR * 1.04), SKIN, seg=48, ring=24)
# slimmer jaw: pull lower verts in
bm = bmesh.new()
bm.from_mesh(head.data)
for v in bm.verts:
    if v.co.z < HC.z - 0.04:
        t = min(1, (HC.z - 0.04 - v.co.z) / 0.2)
        v.co.x *= 1 - 0.22 * t
        v.co.y *= 1 - 0.12 * t
bm.to_mesh(head.data)
bm.free()
parent_keep(head, head_pivot)


def on_face(x, z, inset=0.0):
    # point on the head's front surface (approx ellipsoid) at x/z
    ax, ay, az = HR * 0.94, HR * 0.96, HR * 1.04
    dx, dz = x / ax, (z - HC.z) / az
    y = -ay * math.sqrt(max(0.0, 1 - dx * dx - dz * dz))
    return Vector((x, y + inset, z))


for sx in (-1, 1):
    ear = sphere("ear", (sx * HR * 0.93, 0.0, HC.z - 0.01), (0.03, 0.045, 0.055), SKIN)
    parent_keep(ear, head_pivot)

nose = sphere("nose", on_face(0, HC.z - 0.045, 0.004), (0.034, 0.028, 0.026), SKIN_D)
parent_keep(nose, head_pivot)

# eyes: dark ovals with a catchlight, set just under the glasses
EYE_Z = HC.z + 0.015
for sx in (-1, 1):
    p = on_face(sx * 0.085, EYE_Z, -0.001)
    e = sphere("eye", p, (0.024, 0.012, 0.03), EYE)
    parent_keep(e, head_pivot)
    c = sphere("catch", p + Vector((sx * -0.007, -0.011, 0.011)), (0.007, 0.004, 0.007), WHITE)
    parent_keep(c, head_pivot)
    brow = capsule("brow", on_face(sx * 0.05, EYE_Z + 0.07, 0.0), on_face(sx * 0.12, EYE_Z + 0.065, 0.0), 0.008, HAIR)
    parent_keep(brow, head_pivot)

# closed, warm smile: lower half of a thin torus
bpy.ops.mesh.primitive_torus_add(major_radius=0.05, minor_radius=0.01, major_segments=40, minor_segments=8)
smile = bpy.context.object
smile.name = "smile"
bm = bmesh.new()
bm.from_mesh(smile.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.y > -0.012], context="VERTS")
bm.to_mesh(smile.data)
bm.free()
smile.rotation_euler = (math.radians(90), 0, 0)
smile.scale = (1.35, 1, 0.6)
smile.location = on_face(0, HC.z - 0.095, -0.014) + Vector((0, 0, 0.03))
link(smile, None, LIP)
parent_keep(smile, head_pivot)

# hair: a cap over the skull, hairline high in front, with tight-curl bumps
hair = sphere("hair", HC + Vector((0, 0.012, 0.012)), (HR * 0.99, HR * 1.0, HR * 1.07), HAIR, seg=64, ring=32)
bm = bmesh.new()
bm.from_mesh(hair.data)
kill = []
for v in bm.verts:
    front = max(0.0, -v.co.y / HR)  # 0 back .. 1 front
    side = abs(v.co.x) / HR
    line = HC.z + 0.08 * front - 0.05 * (1 - front) + 0.03 * side * front
    if v.co.z < line:
        kill.append(v)
bmesh.ops.delete(bm, geom=kill, context="VERTS")
bm.to_mesh(hair.data)
bm.free()
tex = bpy.data.textures.new("curls", "VORONOI")
tex.noise_scale = 0.018
d = hair.modifiers.new("curls", "DISPLACE")
d.texture = tex
d.strength = 0.012
s = hair.modifiers.new("thick", "SOLIDIFY")
s.thickness = 0.02
parent_keep(hair, head_pivot)

# glasses: dark rectangular frames + clear lenses + temples
for sx in (-1, 1):
    c = on_face(sx * 0.088, EYE_Z, -0.022)
    f = rbox("frame", c, (0.105, 0.012, 0.072), FRAME, bevel=0.012)
    sol = f.modifiers.new("hollow", "SOLIDIFY")
    # cut the middle by insetting the front/back faces
    bm = bmesh.new()
    bm.from_mesh(f.data)
    faces = [fc for fc in bm.faces if abs(fc.normal.y) > 0.9]
    r = bmesh.ops.inset_individual(bm, faces=faces, thickness=0.011)
    inner = [fc for fc in faces]
    bmesh.ops.delete(bm, geom=inner, context="FACES")
    bm.to_mesh(f.data)
    bm.free()
    f.modifiers.remove(sol)
    parent_keep(f, head_pivot)
    lens = rbox("lens", c + Vector((0, 0.002, 0)), (0.085, 0.003, 0.052), LENS, bevel=0.008)
    parent_keep(lens, head_pivot)
    t = capsule("temple", c + Vector((sx * 0.052, 0.0, 0.012)), Vector((sx * HR * 0.93, 0.0, EYE_Z + 0.01)), 0.0055, FRAME)
    parent_keep(t, head_pivot)
bridge = capsule("bridge", on_face(-0.035, EYE_Z + 0.008, -0.026), on_face(0.035, EYE_Z + 0.008, -0.026), 0.0065, FRAME)
parent_keep(bridge, head_pivot)

# ---------- body ----------
neck = capsule("neck", (0, 0.005, 0.47), (0, 0.005, 0.53), 0.045, SKIN)
parent_keep(neck, body)
torso = sphere("torso", (0, 0, 0.36), (0.15, 0.105, 0.155), TEE, seg=40, ring=20)
bm = bmesh.new()
bm.from_mesh(torso.data)
for v in bm.verts:  # flatter bottom, squarer shoulders
    if v.co.z < 0.30:
        v.co.z = 0.30 + (v.co.z - 0.30) * 0.55
    if v.co.z > 0.42:
        k = (v.co.z - 0.42) / 0.1
        v.co.x *= 1 + 0.18 * k
bm.to_mesh(torso.data)
bm.free()
parent_keep(torso, body)
collar = capsule("collar", (0, 0.003, 0.495), (0, 0.003, 0.505), 0.052, TEE)
parent_keep(collar, body)

# gold Z on the chest (the Zevbii mark)
bpy.ops.object.text_add(location=(0, -0.104, 0.37))
z = bpy.context.object
z.data.body = "Z"
z.data.extrude = 0.004
z.data.size = 0.085
z.data.align_x = "CENTER"
z.data.align_y = "CENTER"
z.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.convert(target="MESH")
z = bpy.context.object
link(z, None, GOLD)
parent_keep(z, body)

# arms: pivot at the shoulder, sleeve + forearm + hand
def arm(side):
    sx = 1 if side == "L" else -1
    sh = Vector((sx * 0.155, 0, 0.45))
    piv = empty("arm_" + side, sh, body)
    sleeve = sphere("sleeve_" + side, sh + Vector((sx * 0.02, 0, -0.04)), (0.058, 0.058, 0.07), TEE)
    parent_keep(sleeve, piv)
    fa = capsule("forearm_" + side, sh + Vector((sx * 0.03, 0, -0.07)), sh + Vector((sx * 0.045, 0, -0.17)), 0.034, SKIN)
    parent_keep(fa, piv)
    hand = sphere("hand_" + side, sh + Vector((sx * 0.048, 0, -0.205)), (0.042, 0.036, 0.046), SKIN)
    parent_keep(hand, piv)
    return piv, hand


arm_l, hand_l = arm("L")
arm_r, hand_r = arm("R")

# laptop tucked under the left arm
lap = empty("laptop", (0.2, 0.02, 0.33), arm_l)
lb = rbox("laptop_body", (0.2, 0.02, 0.33), (0.02, 0.2, 0.15), LAPTOP, bevel=0.006)
parent_keep(lb, lap)
ls = rbox("laptop_logo", (0.211, 0.02, 0.33), (0.002, 0.03, 0.03), GOLD, bevel=0.002)
parent_keep(ls, lap)

# legs + shoes (fixed to root so the body can bob)
for sx in (-1, 1):
    leg = capsule("leg", (sx * 0.06, 0, 0.27), (sx * 0.065, 0, 0.09), 0.052, JEANS)
    parent_keep(leg, root)
    shoe = rbox("shoe", (sx * 0.066, -0.025, 0.04), (0.085, 0.15, 0.065), SHOE, bevel=0.03)
    parent_keep(shoe, root)
    sole = rbox("sole", (sx * 0.066, -0.025, 0.008), (0.088, 0.155, 0.016), SOLE, bevel=0.006)
    parent_keep(sole, root)

# ---------- animation: 72 frames, loops ----------
def key(o, path, frame, value, idx=None):
    if idx is None:
        setattr(o, path, value)
        o.keyframe_insert(path, frame=frame)
    else:
        getattr(o, path)[idx] = value
        o.keyframe_insert(path, index=idx, frame=frame)


base_body_z = body.location.z
for f, dz in ((0, 0), (18, 0.008), (36, 0), (54, 0.008), (72, 0)):
    key(body, "location", f, base_body_z + dz, 2)
for f, a in ((0, 0), (36, 4), (72, 0)):
    key(head_pivot, "rotation_euler", f, math.radians(a), 1)
for f, a in ((0, -3), (36, 3), (72, -3)):
    key(head_pivot, "rotation_euler", f, math.radians(a), 0)

# right arm waves: raise sideways, wag, lower
for f, a in ((0, 0), (10, 150), (20, 130), (30, 155), (40, 130), (50, 150), (62, 0), (72, 0)):
    key(arm_r, "rotation_euler", f, math.radians(a), 1)
# left arm holds the laptop slightly forward
for f in (0, 72):
    key(arm_l, "rotation_euler", f, math.radians(8), 1)
for f, a in ((0, 0), (36, -4), (72, 0)):
    key(arm_l, "rotation_euler", f, math.radians(a), 0)

for o in bpy.data.objects:
    if o.animation_data and o.animation_data.action:
        for fc in getattr(o.animation_data.action, "fcurves", []):
            for kp in fc.keyframe_points:
                kp.interpolation = "BEZIER"

# ---------- export ----------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_animations=True,
    export_animation_mode="SCENE",
    export_yup=True,
)
print("EXPORTED", OUT)

if PREVIEW:
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    cam.location = (1.0, -4.4, 0.62)
    cam.rotation_euler = (math.radians(89), 0, math.radians(12.5))
    cam.data.lens = 85
    scene.camera = cam
    for loc, e in (((2, -2, 3), 4.0), ((-2, -1, 1.5), 1.5)):
        l = bpy.data.objects.new("l", bpy.data.lights.new("l", "SUN"))
        scene.collection.objects.link(l)
        l.rotation_euler = Vector(loc).to_track_quat("Z", "Y").to_euler()
        l.data.energy = e
    w = bpy.data.worlds.new("w")
    scene.world = w
    w.use_nodes = True
    w.node_tree.nodes["Background"].inputs[0].default_value = lin("#f2f4f7")
    w.node_tree.nodes["Background"].inputs[1].default_value = 0.8
    scene.render.resolution_x, scene.render.resolution_y = 600, 800
    scene.render.filepath = PREVIEW
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    scene.frame_set(20)
    bpy.ops.render.render(write_still=True)
    print("PREVIEW", PREVIEW)
