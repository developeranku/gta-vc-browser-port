import secrets
import base64
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

class BasicAuthMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, username, password):
        super().__init__(app)
        self.username = username
        self.password = password

    async def dispatch(self, request: Request, call_next):
        # Skip auth for OPTIONS requests (CORS)
        if request.method == "OPTIONS":
            return await call_next(request)

        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return self._unauthorized()
        
        try:
            scheme, credentials = auth_header.split()
            if scheme.lower() != "basic":
                return self._unauthorized()
            
            decoded = base64.b64decode(credentials).decode("utf-8")
            username, password = decoded.split(":", 1)
            
            if not (secrets.compare_digest(username, self.username) and 
                    secrets.compare_digest(password, self.password)):
                return self._unauthorized()
        except Exception:
            return self._unauthorized()

        return await call_next(request)

    def _unauthorized(self):
        return Response(
            content="Unauthorized",
            status_code=401,
            headers={"WWW-Authenticate": "Basic realm='Restricted'"}
        )
