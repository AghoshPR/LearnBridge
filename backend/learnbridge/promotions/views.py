from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from authapp.permissions import IsAdmin
from .models import *
from .serializers import *


class AdminOfferListView(APIView):

    permission_classes = [IsAdmin]


    def get(self,request):

        offers = Offer.objects.filter(is_deleted=False).order_by("-created_at")
        serializer = OfferSerializer(offers,many=True)
        return Response(serializer.data)

class AdminOfferCreateView(APIView):

    permission_classes = [IsAdmin]

    def post(self,request):
        
        serializer = OfferSerializer(data=request.data)

        if serializer.is_valid():

            serializer.save()
            return Response(serializer.data,status=201)

        return Response(serializer.errors,status=400)
    
class AdminOfferUpdateView(APIView):

    permission_classes = [IsAdmin]

    def put(self,request,pk):

        try:
            offer = Offer.objects.get(pk=pk,is_deleted=False)

        except Offer.DoesNotExist:
            return Response({"error":"Offer not found"},status=404)

        serializers = OfferSerializer(offer,data=request.data,partial=True)

        if serializers.is_valid():

            serializers.save()
            return Response(serializers.data)
        
        return Response(serializers.errors,status=400)
    
class AdminOfferDeleteView(APIView):

    permission_classes = [IsAdmin]

    def delete(self,request,pk):

        try:

            offer = Offer.objects.get(pk=pk)
        
        except Offer.DoesNotExist:

            return Response({"error":"Offer not found"})
        
        offer.is_deleted=True
        offer.is_active=False
        offer.save()

        return Response({"message":"offer deleted successfully"})
