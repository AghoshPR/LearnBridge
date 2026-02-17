from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import *
from .serializers import *
from authapp.permissions import *


# admin tag view


class AdminTagListView(APIView):

    permission_classes = [IsAdmin]

    def get(self,request):

        tags = Tag.objects.filter(is_active=True).order_by("-created_at")
        serializer  = AdminTagSerializer(tags,many=True)
        return Response(serializer.data)
    

class AdminTagCreateView(APIView):

    permission_classes=[IsAdmin]

    def post(self,request):

        serializer = AdminTagSerializer(data = request.data)
        if serializer.is_valid():

            serializer.save()
            return Response(
                {"message":"Tag created successfully"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class AdminTagUpdateView(APIView):

    permission_classes = [IsAdmin]

    def patch(self,request,pk):

        try:

            tag = Tag.objects.get(pk=pk)

        except Tag.DoesNotExist:
            return Response({"error":"Tag not found"},status=404)
        
        serializer = AdminTagSerializer(tag, data = request.data,partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response({"message":"Tag updated successfully"})
        return Response(serializer.errors,status=400)
    
class AdminTagDeleteView(APIView):

    permission_classes =[IsAdmin]


    def delete(self,request,pk):

        try:

            tag = Tag.objects.get(pk=pk,is_active=True)
        
        except Tag.DoesNotExist:
            return Response({"error":"Tag not found"},status=404)
        
        tag.is_active=False
        tag.save()

        return Response({"message":"Tag deleted successfully"})

