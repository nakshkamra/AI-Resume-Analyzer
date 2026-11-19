import pkgutil, json, sys
mods = [m.name for m in pkgutil.iter_modules()]
print(json.dumps([m for m in mods if m.startswith('fitz') or m.startswith('pdf') or m.startswith('docx')]))
