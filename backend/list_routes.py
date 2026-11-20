import json
import importlib
app = importlib.import_module('app.main').app
routes = [{'path': r.path, 'methods': list(r.methods)} for r in app.routes]
print(json.dumps(routes, indent=2))
