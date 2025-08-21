import os

# Folder containing your files
folder = "mortgage-statement/images"

count = 0  # counter for renamed files

for filename in os.listdir(folder):
    old_path = os.path.join(folder, filename)

    # Skip if it's a folder
    if not os.path.isfile(old_path):
        continue

    name, ext = os.path.splitext(filename)
    new_name = None

    # Skip if it already contains "download template"
    if "download template" in name.lower():
        continue

    # Case 1: filename contains "template"
    if "template" in name.lower():
        # insert "download " before "template"
        new_name = name.replace("template", "download template")
    else:
        # Case 2: no "template" in filename → add " download template"
        new_name = f"{name} download template"

    # Reconstruct filename with extension
    new_filename = f"{new_name}{ext}"
    new_path = os.path.join(folder, new_filename)

    # Rename only if name actually changes
    if filename != new_filename:
        os.rename(old_path, new_path)
        print(f"Renamed: {filename} → {new_filename}")
        count += 1

print(f"✅ Done renaming files. Total renamed: {count}")
