from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(AdminWallet)
admin.site.register(AdminTransaction)
admin.site.register(TeacherWallet)
admin.site.register(TeacherTransaction)