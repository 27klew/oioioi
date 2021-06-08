# -*- coding: utf-8 -*-
# Generated by Django 1.11.29 on 2021-06-08 13:58
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('problems', '0028_problemname'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tag',
            name='problems',
        ),
        migrations.AlterUniqueTogether(
            name='tagthrough',
            unique_together=set([]),
        ),
        migrations.RemoveField(
            model_name='tagthrough',
            name='problem',
        ),
        migrations.RemoveField(
            model_name='tagthrough',
            name='tag',
        ),
        migrations.DeleteModel(
            name='Tag',
        ),
        migrations.DeleteModel(
            name='TagThrough',
        ),
    ]
