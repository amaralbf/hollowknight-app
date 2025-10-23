import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ASSETS_PATH = Path(__file__).parents[1] / "src/assets"


FILE_TRANSFORMATIONS = {
    "bretta_infected.png": (4, -2, 1.2),
    "bretta.png": (7, 0, 1),
    "broken_vessel.png": (-15, 7, 1),
    "brooding_mawlek.png": (-4, 8, 0.7),
    "brumm.png": (1, 3, 0.8),
    "charged_lumafly.png": (0, 0, 0.45),
    "confessor_jiji.png": (0, 0, 0.6),
    "cornifer.png": (1, -6, 1),
    "crystal_guardian.png": (-15, -3, 0.75),
    "divine.png": (33, 3, 0.7),
    "dung_defender.png": (-3, -5, 1),
    "elder_hu.png": (1, 10, 1),
    "eternal_emilitia.png": (0, 0, 1),
    "false_knight.png": (-15, -13, 0.95),
    "flukemarm.png": (3, 7, 0.5),
    "galien.png": (-5, -19, 0.7),
    "garpede.png": (0, 5, 0.5),
    "goam.png": (0, 7, 0.5),
    "god_tamer.png": (12, 5, 0.3),
    "godseeker.png": (-25, 0, 0.5),
    "gorb.png": (5, -20, 0.65),
    "gorgeous_husk.png": (5, 3, 0.8),
    "grey_prince_zote.png": (20, -10, 0.7),
    "grimm.png": (-8, -5, 1),
    "grimmkin_master.png": (0, 10, 0.4),
    "grimmkin_nightmare.png": (3, -3, 0.5),
    "grimmkin_novice.png": (0, -2, 0.4),
    "grubfather.png": (5, 10, 1),
    "gruz_mother_awake.png": (7, -5, 0.7),
    "gruz_mother.png": (18, 32, 0.6),
    "herrah_the_beast.png": (10, -7, 0.9),
    "hive_knight.png": (20, -20, 0.8),
    "hollow_knight.png": (2, 15, 0.77),
    "hornet.png": (7, 4, 1),
    "hunter.png": (0, -5, 0.37),
    "iselda.png": (-10, 2, 0.7),
    "last_stag.png": (10, -30, 0.6),
    "leg_eater.png": (-10, -10, 0.7),
    "lost_kin.png": (-5, -10, 1),
    "lurien_the_watcher.png": (0, 5, 0.9),
    "mantis_lords.png": (-1, -40, 0.8),
    "markoth.png": (-3, -27, 0.7),
    "marmu.png": (10, -20, 0.7),
    "massive_moss_charger.png": (-30, -26, 0.6),
    "millibelle.png": (0, 0, 1),
    "monomon_the_teacher.png": (8, 3, 1),
    "mossy_vagabond.png": (0, 12, 0.5),
    "nailsmith_corpse.png": (0, 30, 0.4),
    "nailsmith_sheo.png": (-5, 0, 0.5),
    "nailsmith.png": (10, -7, 0.6),
    "nightmare_king_grimm.png": (-2, -21, 0.9),
    "no_eyes.png": (1, -22, 0.75),
    "nosk.png": (15, -40, 0.8),
    "oblobble.png": (12, -20, 0.5),
    "pale_lurker.png": (-10, 10, 0.8),
    "relic_seeker_lemm.png": (-12, 0, 0.5),
    "royal_waterways_pump.png": (-2, -24, 0.5),
    "salubra.png": (12, 5, 0.45),
    "sly_infected.png": (7, -25, 2),
    "slys_shop.png": (-9, 7, 0.7),
    "soul_master.png": (5, 7, 0.75),
    "soul_tyrant.png": (6, 0, 1),
    "soul_warrior.png": (15, -45, 0.6),
    "steelsoul_jinn.png": (6, 0, 0.8),
    "the_collector.png": (22, -10, 0.8),
    "traitor_lord.png": (-8, 0, 0.9),
    "traitors_child.png": (0, 5, 0.9),
    "tuk.png": (-18, -35, 0.4),
    "uumuu.png": (2, 11, 0.3),
    "vengefly_king.png": (27, -38, 0.7),
    "vengeful_spirit.png": (3, 8, 1),
    "watcher_knights.png": (5, -8, 0.6),
    "whispering_root.png": (7, 0, 0.65),
    "white_defender.png": (0, -20, 1),
    "white_lady.png": (-3, -8, 0.9),
    "xero.png": (0, -20, 1),
    "zote_deepnest.png": (0, 30, 0.9),
    "zote_greenpath.png": (-9, -40, 0.7),
    "zote_skull.png": (-2, -24, 1),
}


def process_image(input_path, output_path, x_offset_perc, y_offset_perc, scale):
    # 1. Load image
    img = Image.open(input_path).convert("RGBA")

    img = img.resize((int(img.width * scale), int(img.height * scale)), Image.LANCZOS)

    # 2. Create black canvas
    canvas_size = (142, 142)
    canvas = Image.new("RGB", canvas_size, (30, 30, 30))

    x = (canvas_size[0] - img.width) // 2
    y = 0

    x += int(img.width * x_offset_perc / 100)
    y += int(img.height * y_offset_perc / 100)

    # y = (canvas_size[1] - img.height) // 2
    # x = 0
    canvas.paste(img, (x, y), img)

    # if str(input_path).endswith('divine.png'):
    #     print(f'{canvas_size[0]=} {canvas_size[1]=}')
    #     print(f'{img.width=} {img.height=}')
    #     print(f'{x=} {y=}')

    # 3. Create circular mask
    mask = Image.new("L", canvas_size, 0)
    draw = ImageDraw.Draw(mask)
    radius = min(canvas_size) // 2 - 9
    center = (canvas_size[0] // 2, canvas_size[1] // 2)

    draw.ellipse(
        (
            center[0] - radius,
            center[1] - radius,
            center[0] + radius,
            center[1] + radius,
        ),
        fill=255,
    )

    # Smooth edges
    mask = mask.filter(ImageFilter.GaussianBlur(1.5))

    # # 4. Create glow (slightly larger ellipse, blurred)
    # glow = Image.new("L", canvas_size, 0)
    # draw = ImageDraw.Draw(glow)
    # glow_radius = radius + 8   # bigger than mask
    # draw.ellipse(
    #     (center[0] - glow_radius, center[1] - glow_radius,
    #     center[0] + glow_radius, center[1] + glow_radius),
    #     fill=255
    # )

    # 4. Create glow (slightly larger ellipse, blurred)
    glow = Image.new("L", canvas_size, 0)
    draw = ImageDraw.Draw(glow)

    glow_radius = radius + 4  # closer to mask, not too big
    draw.ellipse(
        (
            center[0] - glow_radius,
            center[1] - glow_radius,
            center[0] + glow_radius,
            center[1] + glow_radius,
        ),
        fill=255,
    )

    # Softer blur, smaller spread
    glow = glow.filter(ImageFilter.GaussianBlur(1))

    # Convert to white translucent RGBA
    glow_img = Image.new("RGBA", canvas_size, (200, 200, 200, 0))
    glow_img.putalpha(glow.point(lambda p: int(p * 1)))  # 40% opacity

    # 5. Composite: glow behind + masked image
    circular_img = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    circular_img.alpha_composite(glow_img)  # glow first
    circular_img.paste(canvas, (0, 0), mask)  # masked image on top

    # Save result
    circular_img.save(output_path, "PNG")


if __name__ == "__main__":
    input_folder = Path("input")
    output_folder = ASSETS_PATH / "pins"
    os.makedirs(output_folder, exist_ok=True)

    _diff = set(f for f in os.listdir(input_folder)).symmetric_difference(
        set(FILE_TRANSFORMATIONS.keys())
    )
    assert not _diff, f"Diff error: {_diff}"

    for file_name, (
        x_offset_perc,
        y_offset_perc,
        scale,
    ) in FILE_TRANSFORMATIONS.items():
        if file_name.endswith(".png"):
            input_path = input_folder / file_name
            output_path = output_folder / file_name

            process_image(input_path, output_path, x_offset_perc, y_offset_perc, scale)
