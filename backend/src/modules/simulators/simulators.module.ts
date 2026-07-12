import { Module } from '@nestjs/common';
import { SimulatorsService } from './simulators.service';
import { SimulatorsController } from './simulators.controller';

@Module({
  providers: [SimulatorsService],
  controllers: [SimulatorsController],
  exports: [SimulatorsService],
})
export class SimulatorsModule {}
