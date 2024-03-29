# Generated by Django 3.2.23 on 2023-12-04 04:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('eventapp', '0004_alter_user_username'),
    ]

    operations = [
        migrations.CreateModel(
            name='EventDate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(blank=True, db_column='Date', null=True)),
                ('event', models.ForeignKey(db_column='EventID', on_delete=django.db.models.deletion.CASCADE, to='eventapp.event')),
            ],
            options={
                'db_table': 'eventdate',
            },
        ),
        migrations.AddConstraint(
            model_name='eventdate',
            constraint=models.UniqueConstraint(fields=('event', 'date'), name='unique_date_for_event'),
        ),
    ]
