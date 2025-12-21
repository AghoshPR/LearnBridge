from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):

    def has_permission(self, request, view):
        
        return(
            request.user.is_authenticated and
            request.user.role == 'teacher' and
            request.user.is_active and 
            request.user.status == 'active' and 
            hasattr(request.user,'teacher_profile') and 
            request.user.teacher_profile.status == 'approved'
        )
    

class IsAdmin(BasePermission):

    def has_permission(self, request, view):
        
        return (

            request.user.is_authenticated and  (request.user.role == 'admin' or request.user.is_superuser)
        )