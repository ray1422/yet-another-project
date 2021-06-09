# Generated by Django 3.2.4 on 2021-06-04 00:21

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0003_auto_20210603_2342'),
    ]

    operations = [
        migrations.AddField(
            model_name='board',
            name='ip',
            field=models.CharField(default=django.utils.timezone.now, max_length=65),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='board',
            name='author',
            field=models.CharField(max_length=32),
        ),
    ]