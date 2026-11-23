# Chibi "Val" mascot for zevbii.com, built by script (no generators).
#   blender -b -P tools/chibi_dev.py -- public/mascot/val.glb [preview.png [pose]]
# Faces -Y in Blender (= +Z toward the camera in three.js). No baked animation:
# the site drives these named pivots in code: val > body > head, arm_L, arm_R;
# val > leg_L, leg_R. Rest pose: arms down, legs straight.
import bpy, bmesh, math, random, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "val.glb"
PREVIEW = argv[1] if len(argv) > 1 else None
random.seed(7)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene


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
        try:
            m.surface_render_method = "BLENDED"
        except Exception:
            pass
    return m


SKIN = mat("skin", "#6b4129", 0.62)
SKIN_D = mat("skin_shade", "#56321f", 0.65)
HAIR = mat("hair", "#17120f", 0.95)
TEE = mat("tee", "#1b1c21", 0.9)
TEE_RIB = mat("tee_rib", "#26272e", 0.9)
JEANS = mat("jeans", "#33507a", 0.85)
SHOE = mat("shoe", "#f4f2ec", 0.55)
SOLE = mat("sole", "#d4a12a", 0.5)
FRAME = mat("frame", "#0b0b0d", 0.35)
LENS = mat("lens", "#ffffff", 0.05, 0.0, 0.07)
EYE = mat("eye", "#120c0a", 0.2)
WHITE = mat("catchlight", "#ffffff", 0.3)
MOUTH = mat("mouth", "#3a1b12", 0.5)
GOLD = mat("gold", "#d4a12a", 0.35, 0.7)
SILVER = mat("laptop", "#b9bec7", 0.35, 0.6)


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def setmat(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def sphere(loc, scale, m, seg=32, ring=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=seg, ring_count=ring, location=loc)
    o = bpy.context.object
    o.scale = scale
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)
    return smooth(setmat(o, m))


def capsule(a, b, ra, m, rb=None, seg=20):
    """Tapered capsule from a (radius ra) to b (radius rb)."""
    rb = ra if rb is None else rb
    a, b = Vector(a), Vector(b)
    bm = bmesh.new()
    axis = (b - a).normalized()
    q = axis.to_track_quat("Z", "Y")
    rings = []
    # hemisphere at a, cylinder, hemisphere at b
    prof = []
    for i in range(7):
        t = math.pi / 2 * (1 - i / 6)
        prof.append((-math.sin(t) * ra, math.cos(t) * ra, 0.0))
    for i in range(7):
        t = math.pi / 2 * (i / 6)
        prof.append((math.sin(t) * rb, math.cos(t) * rb, 1.0))
    L = (b - a).length
    for z, r, end in prof:
        ring = []
        base = a + axis * (z if end == 0.0 else L + z)
        for k in range(seg):
            ang = 2 * math.pi * k / seg
            off = q @ Vector((math.cos(ang) * r, math.sin(ang) * r, 0))
            ring.append(bm.verts.new(base + off))
        rings.append(ring)
    for r0, r1 in zip(rings, rings[1:]):
        for k in range(seg):
            bm.faces.new((r0[k], r0[(k + 1) % seg], r1[(k + 1) % seg], r1[k]))
    bm.faces.new(list(reversed(rings[0])))
    bm.faces.new(rings[-1])
    me = bpy.data.meshes.new("capsule")
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("capsule", me)
    scene.collection.objects.link(o)
    return smooth(setmat(o, m))


def rbox(loc, size, m, bevel=0.01, segs=4):
    bpy.ops.mesh.primitive_cube_add(location=loc)
    o = bpy.context.object
    o.scale = (size[0] / 2, size[1] / 2, size[2] / 2)
    bpy.ops.object.transform_apply(location=True, rotation=False, scale=True)
    md = o.modifiers.new("bev", "BEVEL")
    md.width = bevel
    md.segments = segs
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.modifier_apply(modifier="bev")
    return smooth(setmat(o, m))


def join(objs, name):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    o = bpy.context.object
    o.name = name
    return o


def pivot(name, loc, parent=None):
    e = bpy.data.objects.new(name, None)
    scene.collection.objects.link(e)
    e.location = Vector(loc) - (parent.matrix_world.translation if parent else Vector())
    if parent:
        e.parent = parent
    bpy.context.view_layer.update()
    return e


def attach(objs, p, name):
    """Join meshes, then parent to pivot p keeping world placement."""
    o = join(objs, name) if len(objs) > 1 else objs[0]
    o.name = name
    bpy.context.view_layer.update()
    mw = o.matrix_world.copy()
    o.parent = p
    o.matrix_parent_inverse = p.matrix_world.inverted()
    o.matrix_world = mw
    return o


# ---------------- proportions (feet at z=0, crown ~1.0) ----------------
HC = Vector((0, 0, 0.735))
HR = 0.235
EYE_Z = HC.z - 0.005

root = pivot("val", (0, 0, 0))
body = pivot("body", (0, 0, 0.27), root)
head = pivot("head", (0, 0, 0.5), body)
arm_l = pivot("arm_L", (0.15, 0, 0.445), body)
arm_r = pivot("arm_R", (-0.15, 0, 0.445), body)
leg_l = pivot("leg_L", (0.062, 0, 0.27), root)
leg_r = pivot("leg_R", (-0.062, 0, 0.27), root)


def face_pt(x, z, out=0.0):
    ax, ay, az = HR * 1.0, HR * 0.94, HR * 0.98
    dx, dz = x / ax, (z - HC.z) / az
    y = -ay * math.sqrt(max(0.0, 1 - dx * dx - dz * dz))
    return Vector((x, y - out, z))


# ---------------- head ----------------
skull = sphere(HC, (HR, HR * 0.94, HR * 0.98), SKIN, 64, 32)
bm = bmesh.new()
bm.from_mesh(skull.data)
for v in bm.verts:  # soft chin + fuller cheeks
    dz = v.co.z - HC.z
    if dz < -0.02:
        t = min(1.0, (-dz - 0.02) / 0.2)
        v.co.x *= 1 - 0.16 * t * t
    if -0.11 < dz < 0.0 and v.co.y < 0:
        v.co.x *= 1.03
bm.to_mesh(skull.data)
bm.free()
parts = [skull]
for sx in (-1, 1):
    parts.append(sphere((sx * HR * 0.97, 0.01, HC.z - 0.015), (0.026, 0.04, 0.05), SKIN))
parts.append(sphere(face_pt(0, HC.z - 0.05, -0.012), (0.026, 0.022, 0.02), SKIN_D))  # nose
head_mesh = attach(parts, head, "head_mesh")

# eyes: dark ovals + two catchlights (visible through clear lenses)
eyes = []
for sx in (-1, 1):
    p = face_pt(sx * 0.082, EYE_Z, 0.0)
    eyes.append(sphere(p, (0.026, 0.012, 0.032), EYE, 24, 12))
    eyes.append(sphere(p + Vector((sx * -0.008, -0.011, 0.012)), (0.008, 0.004, 0.008), WHITE, 12, 6))
    eyes.append(sphere(p + Vector((sx * 0.007, -0.011, -0.01)), (0.004, 0.003, 0.004), WHITE, 8, 4))
attach(eyes, head, "eyes")

brows = []
for sx in (-1, 1):
    brows.append(capsule(face_pt(sx * 0.045, EYE_Z + 0.072, 0.002),
                         face_pt(sx * 0.118, EYE_Z + 0.064, 0.002), 0.011, HAIR, 0.008, 12))
attach(brows, head, "brows")

# small warm smile: arc of a thin tube
bm = bmesh.new()
pts = []
for i in range(17):
    t = -1 + 2 * i / 16
    x = t * 0.04
    z = HC.z - 0.105 + 0.016 * t * t
    pts.append(face_pt(x, z, 0.004))
segs = []
for a, b in zip(pts, pts[1:]):
    segs.append(capsule(a, b, 0.0062, MOUTH, None, 10))
attach(segs, head, "mouth")

# hair: scalp cap + tight curls, clean hairline with temple corners
cap = sphere(HC + Vector((0, 0.01, 0.01)), (HR * 1.04, HR * 1.0, HR * 1.03), HAIR, 48, 24)


def hairline_z(v):
    front = max(0.0, -(v.y - HC.y) / HR)  # 1 at the face
    side = min(1.0, abs(v.x) / HR)
    z = HC.z + 0.11 * front * (1 - 0.35 * side) + 0.0 * (1 - front)
    if front < 0.35:  # sides/back come down to the ears
        z = HC.z - 0.02 + 0.08 * front
    return z


bm = bmesh.new()
bm.from_mesh(cap.data)
bmesh.ops.delete(bm, geom=[v for v in bm.verts if v.co.z < hairline_z(v.co)], context="VERTS")
bm.to_mesh(cap.data)
bm.free()
curls = [cap]
cverts = [cap.matrix_world @ v.co for v in cap.data.vertices]
random.shuffle(cverts)
center = HC + Vector((0, 0.01, 0.0))
for p in cverts[:260]:
    n = (p - center).normalized()
    r = random.uniform(0.019, 0.027)
    bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=1, radius=r, location=p + n * 0.004)
    c = bpy.context.object
    smooth(setmat(c, HAIR))
    curls.append(c)
attach(curls, head, "hair")

# glasses: rounded-rectangle frames, clear lenses, temples
glasses = []
for sx in (-1, 1):
    c = face_pt(sx * 0.084, EYE_Z, 0.03)
    f = rbox(c, (0.112, 0.012, 0.078), FRAME, 0.014, 4)
    bm = bmesh.new()
    bm.from_mesh(f.data)
    fs = [fc for fc in bm.faces if abs(fc.normal.y) > 0.95 and fc.calc_area() > 0.004]
    bmesh.ops.inset_region(bm, faces=fs, thickness=0.012, use_even_offset=True)
    bmesh.ops.delete(bm, geom=fs, context="FACES")
    bm.to_mesh(f.data)
    bm.free()
    smooth(f)
    glasses.append(f)
    glasses.append(capsule(c + Vector((sx * 0.056, 0.004, 0.014)),
                           Vector((sx * HR * 0.97, 0.0, EYE_Z + 0.012)), 0.006, FRAME, None, 8))
glasses.append(capsule(face_pt(-0.03, EYE_Z + 0.01, 0.03), face_pt(0.03, EYE_Z + 0.01, 0.03), 0.0065, FRAME, None, 8))
attach(glasses, head, "glasses")
lenses = []
for sx in (-1, 1):
    lenses.append(rbox(face_pt(sx * 0.084, EYE_Z, 0.028), (0.09, 0.003, 0.056), LENS, 0.01, 3))
attach(lenses, head, "lenses")

# ---------------- body ----------------
torso = sphere((0, 0, 0.36), (0.145, 0.108, 0.15), TEE, 40, 20)
bm = bmesh.new()
bm.from_mesh(torso.data)
for v in bm.verts:
    if v.co.z < 0.30:  # flat hem
        v.co.z = 0.30 - (0.30 - v.co.z) * 0.45
    if v.co.z > 0.40:  # square-ish shoulders
        v.co.x *= 1 + 0.25 * (v.co.z - 0.40) / 0.11
bm.to_mesh(torso.data)
bm.free()
neck = capsule((0, 0.004, 0.47), (0, 0.004, 0.52), 0.042, SKIN, None, 16)
rib = capsule((0, 0.004, 0.495), (0, 0.004, 0.502), 0.054, TEE_RIB, None, 20)
bpy.ops.object.text_add(location=(0, -0.106, 0.365))
z = bpy.context.object
z.data.body = "Z"
z.data.extrude = 0.003
z.data.size = 0.08
z.data.align_x = "CENTER"
z.data.align_y = "CENTER"
z.rotation_euler = (math.radians(90), 0, 0)
bpy.ops.object.convert(target="MESH")
z = setmat(bpy.context.object, GOLD)
attach([torso, neck, rib], body, "torso")
attach([z], body, "logo")


def arm(p, sx, name):
    sh = p.matrix_world.translation
    sleeve = capsule(sh + Vector((sx * 0.012, 0, 0.0)), sh + Vector((sx * 0.03, 0, -0.07)), 0.05, TEE, 0.047, 18)
    limb = capsule(sh + Vector((sx * 0.03, 0, -0.06)), sh + Vector((sx * 0.04, 0, -0.165)), 0.031, SKIN, 0.028, 14)
    hand = sphere(sh + Vector((sx * 0.042, -0.004, -0.195)), (0.04, 0.034, 0.042), SKIN, 20, 10)
    thumb = sphere(sh + Vector((sx * 0.022, -0.024, -0.182)), (0.013, 0.013, 0.02), SKIN, 12, 6)
    attach([sleeve], p, name + "_sleeve")
    attach([limb, hand, thumb], p, name + "_skin")


arm(arm_l, 1, "armL")
arm(arm_r, -1, "armR")

# closed laptop under the left arm
lap = rbox((0.205, 0.0, 0.31), (0.018, 0.21, 0.15), SILVER, 0.008, 3)
lz = rbox((0.2145, 0.0, 0.31), (0.002, 0.034, 0.034), GOLD, 0.004, 2)
attach([lap, lz], arm_l, "laptop")


def leg(p, sx, name):
    hip = p.matrix_world.translation
    jeans = capsule(hip + Vector((0, 0, 0.02)), Vector((hip.x + sx * 0.004, 0, 0.085)), 0.056, JEANS, 0.05, 18)
    shoe = sphere((hip.x + sx * 0.004, -0.028, 0.045), (0.056, 0.085, 0.042), SHOE, 24, 12)
    sole = rbox((hip.x + sx * 0.004, -0.028, 0.012), (0.106, 0.165, 0.022), SOLE, 0.01, 3)
    attach([jeans], p, name + "_jeans")
    attach([shoe, sole], p, name + "_shoe")


leg(leg_l, 1, "legL")
leg(leg_r, -1, "legR")

# ---------------- export ----------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=False,
    export_apply=True,
    export_animations=False,
    export_yup=True,
)
print("EXPORTED", OUT)

if PREVIEW:
    pose = argv[2] if len(argv) > 2 else "rest"
    if pose == "wave":
        arm_r.rotation_euler[1] = math.radians(150)
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    cam.location = (0.9, -4.2, 0.55)
    cam.rotation_euler = (math.radians(89.5), 0, math.radians(12))
    cam.data.lens = 85
    scene.camera = cam
    for rot, e in (((50, 0, 25), 3.5), ((70, 0, -120), 1.2)):
        l = bpy.data.objects.new("l", bpy.data.lights.new("l", "SUN"))
        scene.collection.objects.link(l)
        l.rotation_euler = [math.radians(a) for a in rot]
        l.data.energy = e
    w = bpy.data.worlds.new("w")
    scene.world = w
    w.use_nodes = True
    bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = lin("#f2f4f7")
    bg.inputs[1].default_value = 0.9
    scene.render.resolution_x, scene.render.resolution_y = 500, 700
    scene.render.filepath = PREVIEW
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    bpy.ops.render.render(write_still=True)
    print("PREVIEW", PREVIEW)
