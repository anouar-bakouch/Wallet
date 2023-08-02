from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pickle
from .serializers import BudgetSerializer

class BudgetView(APIView):
    def post(self, request):
        # Deserialize the input data
        serializer = BudgetSerializer(data=request.data)
        if serializer.is_valid():
            # Load the model from a file
            with open('model.pkl', 'rb') as f:
                model = pickle.load(f)

            # Make predictions on the input data
            montstru = serializer.validated_data['MONTSTRU']
            monrapp = serializer.validated_data['MONTRAPP']
            budget = model.predict([[montstru, monrapp]])

            # Return the predicted budget as a response
            return Response({'budget': budget[0]}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)