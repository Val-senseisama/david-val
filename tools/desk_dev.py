# Hero desk for zevbii.com, built by script (no generators), same approach as chibi_dev.py.
#   blender -b -P tools/desk_dev.py -- public/desk/desk.glb [preview.png]
# Z up, front faces -Y in Blender (= +Z toward the camera in three.js).
# The site looks up these named nodes and makes them clickable:
#   laptop (with laptop_lid pivot), phone, mug, sword. "desk" is static.
# Desk top surface sits at TOP (Blender Z) = three.js Y.
import bpy, bmesh, math, sys
from mathutils import Vector

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
OUT = argv[0] if argv else "desk.glb"
PREVIEW = argv[1] if len(argv) > 1 else None

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
TOP = 0.765


def lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(x / 12.92 if x <= 0.04045 else ((x + 0.055) / 1.055) ** 2.4 for x in c) + (1,)


def mat(name, hexc, rough=0.6, metal=0.0, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = lin(hexc)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if emit:
        b.inputs["Emission Color"].default_value = lin(hexc)
        b.inputs["Emission Strength"].default_value = emit
    return m


OAK = mat("oak", "#c89a6a", 0.7)
OAK_EDGE = mat("oak_edge", "#a87a4c", 0.75)
INK = mat("ink", "#1b1f27", 0.6)
ALU = mat("alu", "#c3c8d0", 0.35, 0.6)
KEYS = mat("keys", "#2a2f38", 0.8)
SCREEN = mat("screen", "#0e1116", 0.3)
CODE_GOLD = mat("code_gold", "#d4a12a", 0.4, 0, 1.2)
CODE_TEAL = mat("code_teal", "#5fc7b0", 0.4, 0, 1.0)
CODE_MUTE = mat("code_mute", "#8a93a3", 0.4, 0, 0.8)
CODE_PINK = mat("code_pink", "#e3799b", 0.4, 0, 1.0)
PHONE = mat("phone", "#111318", 0.4, 0.3)
PHONE_SCR = mat("phone_screen", "#4f46e5", 0.3, 0, 0.6)
WHITE = mat("white", "#f4f2ec", 0.5)
WHITE_GLOW = mat("white_glow", "#ffffff", 0.4, 0, 0.8)
COFFEE = mat("coffee", "#3b2416", 0.25)
GOLD = mat("gold", "#d4a12a", 0.35, 0.7)
STEEL = mat("steel", "#d9dde3", 0.22, 0.9)
GRIP = mat("grip", "#d9622b", 0.7)


def setmat(o, m):
    o.data.materials.clear()
    o.data.materials.append(m)
    return o


def box(name, loc, size, m, bevel=0.0, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o = bpy.context.object
    o.name = name
    o.scale = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        mod = o.modifiers.new("bevel", "BEVEL")
        mod.width = bevel
        mod.segments = 3
        bpy.ops.object.modifier_apply(modifier=mod.name)
        for p in o.data.polygons:
            p.use_smooth = True
    setmat(o, m)
    if parent:
        put(o, parent)
    return o


def cyl(name, loc, r, h, m, seg=40, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=seg, radius=r, depth=h, location=loc, rotation=rot)
    o = bpy.context.object
    o.name = name
    for p in o.data.polygons:
        p.use_smooth = abs(p.normal.z) < 0.5
    setmat(o, m)
    if parent:
        put(o, parent)
    return o


def empty(name, loc, rot=(0, 0, 0), parent=None):
    e = bpy.data.objects.new(name, None)
    scene.collection.objects.link(e)
    e.location = loc
    e.rotation_euler = rot
    if parent:
        e.parent = parent
    return e


def put(o, parent):
    """Parent keeping the world transform (o was placed in world space)."""
    bpy.context.view_layer.update()
    mw = o.matrix_world.copy()
    o.parent = parent
    o.matrix_world = mw


# ---------------- desk ----------------
desk = empty("desk", (0, 0, 0))
box("desk_top", (0, 0, TOP - 0.025), (1.7, 0.8, 0.05), OAK, 0.012, desk)
box("desk_lip", (0, -0.39, TOP - 0.06), (1.62, 0.03, 0.04), OAK_EDGE, 0.006, desk)
for sx in (-1, 1):
    for sy in (-1, 1):
        box(f"leg_{sx}_{sy}", (sx * 0.78, sy * 0.33, (TOP - 0.05) / 2), (0.05, 0.05, TOP - 0.05), INK, 0.008, desk)

# ---------------- laptop ----------------
laptop = empty("laptop", (0.02, 0.1, TOP))
box("laptop_base", (0.02, 0.1, TOP + 0.011), (0.56, 0.38, 0.022), ALU, 0.008, laptop)
box("laptop_keys", (0.02, 0.14, TOP + 0.0225), (0.48, 0.17, 0.002), KEYS, 0, laptop)
box("laptop_pad", (0.02, -0.02, TOP + 0.0225), (0.17, 0.09, 0.0015), KEYS, 0, laptop)
lid = empty("laptop_lid", (0, 0.19, 0.022), (math.radians(-14), 0, 0), laptop)
bpy.context.view_layer.update()
lw = lid.matrix_world


def on_lid(name, local, size, m):
    o = box(name, lw @ Vector(local), size, m, 0.004 if size[0] > 0.5 else 0)
    o.rotation_euler = lid.matrix_world.to_euler()
    put(o, lid)
    return o


on_lid("lid_shell", (0, 0, 0.18), (0.56, 0.014, 0.36), ALU)
on_lid("lid_screen", (0, -0.0075, 0.185), (0.52, 0.002, 0.32), SCREEN)
code = [  # (indent, width, material) one per line, top to bottom
    (0.00, 0.22, CODE_PINK), (0.03, 0.30, CODE_MUTE), (0.03, 0.18, CODE_TEAL),
    (0.06, 0.26, CODE_GOLD), (0.06, 0.14, CODE_MUTE), (0.03, 0.08, CODE_MUTE),
    (0.00, 0.04, CODE_MUTE), (0.00, 0.20, CODE_PINK), (0.03, 0.28, CODE_TEAL),
    (0.03, 0.12, CODE_GOLD),
]
for i, (ind, w, m) in enumerate(code):
    x = -0.23 + ind + w / 2
    z = 0.32 - i * 0.027
    on_lid(f"code_{i}", (x, -0.009, z), (w, 0.001, 0.011), m)

# ---------------- phone ----------------
phone = empty("phone", (0.68, 0.04, TOP), (0, 0, math.radians(-16)))
pb = phone
bpy.context.view_layer.update()
pw = pb.matrix_world


def on_phone(name, local, size, m):
    o = box(name, pw @ Vector(local), size, m)
    o.rotation_euler = pw.to_euler()
    put(o, pb)
    return o


o = box("phone_body", pw @ Vector((0, 0, 0.008)), (0.13, 0.26, 0.016), PHONE, 0.012)
o.rotation_euler = pw.to_euler()
put(o, pb)
on_phone("phone_screen", (0, 0, 0.0165), (0.116, 0.236, 0.001), PHONE_SCR)
on_phone("phone_bar1", (-0.014, 0.075, 0.0172), (0.06, 0.012, 0.001), WHITE_GLOW)
on_phone("phone_bar2", (-0.024, 0.052, 0.0172), (0.045, 0.008, 0.001), WHITE_GLOW)
on_phone("phone_card", (0, -0.03, 0.0172), (0.094, 0.07, 0.001), WHITE_GLOW)
on_phone("phone_coin", (0.0, -0.09, 0.0172), (0.026, 0.026, 0.001), GOLD)

# ---------------- mug ----------------
mug = empty("mug", (0.42, 0.25, TOP))
cyl("mug_body", (0.42, 0.25, TOP + 0.065), 0.062, 0.13, WHITE, parent=mug)
cyl("mug_coffee", (0.42, 0.25, TOP + 0.118), 0.056, 0.004, COFFEE, parent=mug)
cyl("mug_band", (0.42, 0.25, TOP + 0.085), 0.0628, 0.018, GOLD, parent=mug)
bpy.ops.mesh.primitive_torus_add(
    major_radius=0.036, minor_radius=0.010, location=(0.488, 0.25, TOP + 0.066),
    rotation=(math.radians(90), 0, 0), major_segments=32, minor_segments=12)
h = bpy.context.object
h.name = "mug_handle"
for p in h.data.polygons:
    p.use_smooth = True
setmat(h, WHITE)
put(h, mug)

# ---------------- sword (The Long Road) ----------------
sword = empty("sword", (0.5, -0.22, TOP), (0, 0, math.radians(-18)))
bpy.context.view_layer.update()
sw = sword.matrix_world


def on_sword(o):
    o.matrix_world = sw @ o.matrix_world
    put(o, sword)
    return o


# blade: flat diamond-section with a point, lying along local +X
bm = bmesh.new()
L, W, T = 0.46, 0.045, 0.012
prof = [(-0.2, -W / 2), (L - 0.2 - 0.07, -W / 2), (L - 0.2, 0), (L - 0.2 - 0.07, W / 2), (-0.2, W / 2)]
lo = [bm.verts.new((x, y, 0.008)) for x, y in prof]
hi = [bm.verts.new((x, y, 0.008 + T)) for x, y in prof]
ridge = [bm.verts.new((x, 0, 0.008 + T + 0.004)) for x in (-0.2, L - 0.2 - 0.07)]
bm.faces.new(list(reversed(lo)))
for i in range(len(prof)):
    j = (i + 1) % len(prof)
    bm.faces.new((lo[i], lo[j], hi[j], hi[i]))
bm.faces.new((hi[0], hi[1], ridge[1], ridge[0]))
bm.faces.new((hi[1], hi[2], ridge[1]))
bm.faces.new((hi[2], hi[3], ridge[1]))
bm.faces.new((hi[3], hi[4], ridge[0], ridge[1]))
bm.faces.new((hi[4], hi[0], ridge[0]))
me = bpy.data.meshes.new("blade")
bm.to_mesh(me)
bm.free()
blade = bpy.data.objects.new("sword_blade", me)
scene.collection.objects.link(blade)
setmat(blade, STEEL)
on_sword(blade)
on_sword(box("sword_guard", (-0.215, 0, 0.016), (0.026, 0.15, 0.024), GOLD, 0.006))
on_sword(cyl("sword_grip", (-0.29, 0, 0.016), 0.015, 0.12, GRIP, 20, rot=(0, math.radians(90), 0)))
bpy.ops.mesh.primitive_uv_sphere_add(segments=20, ring_count=10, radius=0.024, location=(-0.36, 0, 0.018))
pm = bpy.context.object
pm.name = "sword_pommel"
for p in pm.data.polygons:
    p.use_smooth = True
setmat(pm, GOLD)
on_sword(pm)

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
    cam = bpy.data.objects.new("cam", bpy.data.cameras.new("cam"))
    scene.collection.objects.link(cam)
    target = Vector((0, 0, 0.62))
    cam.location = Vector((0.35, -3.3, 2.15))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    cam.data.lens = 50
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
    scene.render.resolution_x, scene.render.resolution_y = 800, 600
    scene.render.filepath = PREVIEW
    try:
        scene.render.engine = "BLENDER_EEVEE_NEXT"
    except TypeError:
        scene.render.engine = "BLENDER_EEVEE"
    bpy.ops.render.render(write_still=True)
    print("PREVIEW", PREVIEW)
