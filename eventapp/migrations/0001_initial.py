# Generated by Django 4.2.6 on 2023-11-02 17:36

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('duration', models.TimeField(blank=True, db_column='Duration', null=True)),
                ('recurring', models.BooleanField(db_column='recurring')),
                ('min_start_time', models.TimeField(blank=True, db_column='MinStartTime', null=True)),
                ('max_start_time', models.TimeField(blank=True, db_column='MaxStartTime', null=True)),
            ],
            options={
                'db_table': 'event',
            },
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=255, unique=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to.', related_name='custom_user_groups', related_query_name='custom_user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='custom_user_permissions', related_query_name='custom_user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'db_table': 'user',
            },
        ),
        migrations.CreateModel(
            name='EventDate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_column='Date')),
                ('event', models.ForeignKey(db_column='EventID', on_delete=django.db.models.deletion.CASCADE, to='eventapp.event')),
            ],
            options={
                'db_table': 'eventdate',
            },
        ),
        migrations.AddField(
            model_name='event',
            name='owner',
            field=models.ForeignKey(db_column='ownerid', on_delete=django.db.models.deletion.CASCADE, to='eventapp.user'),
        ),
        migrations.CreateModel(
            name='AvailableFor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField(db_column='Date')),
                ('event', models.ForeignKey(db_column='EventID', on_delete=django.db.models.deletion.CASCADE, to='eventapp.event')),
                ('user', models.ForeignKey(db_column='UserID', on_delete=django.db.models.deletion.CASCADE, to='eventapp.user')),
            ],
            options={
                'db_table': 'availablefor',
            },
        ),
        migrations.AddConstraint(
            model_name='eventdate',
            constraint=models.UniqueConstraint(fields=('event', 'date'), name='unique_event_date'),
        ),
        migrations.AddConstraint(
            model_name='availablefor',
            constraint=models.UniqueConstraint(fields=('user', 'event', 'date'), name='unique_available_for'),
        ),
    ]
