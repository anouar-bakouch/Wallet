from rest_framework import serializers

class BudgetSerializer(serializers.Serializer):

    IDEIMPST = serializers.IntegerField() 
    MONTSTRU = serializers.FloatField()
    MONTRAPP = serializers.FloatField()
    MOISSOLD = serializers.DateField()
    CODTYPAC = serializers.CharField(max_length=3)
    LIBACTGE = serializers.CharField(max_length=50)
    Budgets = serializers.FloatField()

    def validate(self, data):
        if data['MONTSTRU'] < 0:
            raise serializers.ValidationError("MONTSTRU must be greater than 0.")
        if data['MONTRAPP'] < 0:
            raise serializers.ValidationError("MONTRAPP must be greater than 0.")
        return data
    
    def update(self, instance, validated_data):
        instance.MONTSTRU = validated_data.get('MONTSTRU', instance.MONTSTRU)
        instance.MONTRAPP = validated_data.get('MONTRAPP', instance.MONTRAPP)
        instance.Budgets = validated_data.get('Budgets', instance.Budgets)
        instance.save()
        return instance
    
    