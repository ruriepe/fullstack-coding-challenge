from django.views import View
from django.http.response import JsonResponse
from .models import Users
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password,check_password
import json


class UsersView(View):

    def get(self, request, email=''):
        if(email!=''):
            user = list(Users.objects.filter(email=email).values())
            if len(user)>0:
                datos = {'existe':"true"}
            else:
                datos = {'existe':"false"}
            return JsonResponse(datos)   

class RegisterView(View):

    @method_decorator(csrf_exempt)

    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        
        valuesRequestJson = json.loads(request.body)
   
        emailValidate = valuesRequestJson['email']
        password = make_password(valuesRequestJson['password'])

        Users.objects.create(name=valuesRequestJson['name'],last_name=valuesRequestJson['last_name'],gender=valuesRequestJson['gender'],email=valuesRequestJson['email'],password=password)
        
        user = list(Users.objects.filter(email=emailValidate).values())
        
        if len(user)>0:
            datos = {'registro':"true"}
        else:
            datos = {'registro':"false"}

        return JsonResponse(datos)

class LoginView(View):

    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)

    def post(self, request):
        
        valuesRequestJson = json.loads(request.body)

        email = valuesRequestJson['email']
        password_user = valuesRequestJson['password']
        user = Users.objects.filter(email=email).values()
       
        if check_password(password_user, user[0]['password']) == True :
            datos = {'message':"Ok"}
        else:
            datos = {'message':"Nok"}

        return JsonResponse(datos)