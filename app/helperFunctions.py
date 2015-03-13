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

