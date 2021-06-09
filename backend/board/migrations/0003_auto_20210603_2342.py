# Generated by Django 3.2.4 on 2021-06-03 23:42

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0002_auto_20210603_2312'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='board',
            name='edited',
        ),
        migrations.AddField(
            model_name='board',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, default=django.utils.timezone.now),
            preserve_default=False,
        ),
    ]
