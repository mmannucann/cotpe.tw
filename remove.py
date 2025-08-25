import os

# Folder containing your images
folder = r"residence-permit-photolook\images"

# Allowed image extensions
image_exts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"]

for filename in os.listdir(folder):
    old_path = os.path.join(folder, filename)

    # Skip if it's not a file
    if not os.path.isfile(old_path):
        continue

    name, ext = os.path.splitext(filename)

    # Skip non-image files
    if ext.lower() not in image_exts:
        continue

    # Remove "scr" from name
    new_name = name.replace(" front", "")
    new_filename = f"{new_name}{ext}"
    new_path = os.path.join(folder, new_filename)

    # Only rename if name actually changes
    if new_filename != filename:
        os.rename(old_path, new_path)
        print(f"Renamed: {filename} → {new_filename}")

print("✅ Done cleaning filenames.")
