import jsonpickle
from collections import deque
#############
# Varibles
#############
accept_requests = 0


#############
# Functions
#############
# Return true if enabled, false otherwise
def motion_api_enabled():
	return accept_requests

def enable_motion_api():
	accept_requests = True

def disable_motion_api():
	accept_requests = False

class DequeHandler(jsonpickle.handlers.BaseHandler):
    def flatten(self, obj, data):
        return list(obj),obj.maxlen
    def restore(self,obj):
        return deque(obj[0], maxlen=obj[1])
jsonpickle.handlers.register(deque, DequeHandler)
