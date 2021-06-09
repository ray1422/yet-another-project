# Generated by Django 3.2.4 on 2021-06-03 23:12

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('board', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='board',
            old_name='user',
            new_name='author',
        ),
        migrations.AddField(
            model_name='board',
            name='content',
            field=models.TextField(default=django.utils.timezone.now, max_length=200),
            preserve_default=False,
        ),
    ]
