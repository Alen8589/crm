import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './project.schema';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService],
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema }
    ]),
    DatabaseModule
  ]
})
export class ProjectModule { }
