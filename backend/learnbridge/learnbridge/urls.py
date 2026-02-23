
from django.contrib import admin
from django.urls import path,include



urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/',include('authapp.urls')),
    path('api/teacher/',include('teacherapp.urls')),
    path('api/student/',include('studentapp.urls')),
    path('api/admin/',include('adminapp.urls')),
    path('api/courses/',include('courses.urls')),
    path('api/wallet/',include('wallet.urls')),
    path('api/',include('payments.urls')),
    path('api/',include('promotions.urls')),
    path('api/qna/',include('qna.urls')),
    path('api/',include('notifications.urls')),

    

]
