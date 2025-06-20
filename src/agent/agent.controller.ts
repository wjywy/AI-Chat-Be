import {
  Controller,
  // Get,
  Post,
  Body,
  // Patch,
  // Param,
  // Delete,
  // HttpException,
  // HttpStatus,
} from '@nestjs/common';
import { AgentService } from './agent.service';
// import { CreateAgentDto, GenerateContentDto } from './dto/create-agent.dto';
// import { UpdateAgentDto } from './dto/update-agent.dto';
import { AgentType } from './entities/agent.entity';

@Controller('agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  // @Post()
  // create(@Body() createAgentDto: CreateAgentDto) {
  //   return this.agentService.create(createAgentDto);
  // }

  // @Get()
  // findAll() {
  //   return this.agentService.findAll();
  // }

  // @Get('templates')
  // getAgentTemplates() {
  //   return this.agentService.getAgentTemplates();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.agentService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
  //   return this.agentService.update(+id, updateAgentDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.agentService.remove(+id);
  // }

  // 核心功能：生成内容
  // @Post('generate')
  // async generateContent(@Body() generateContentDto: GenerateContentDto) {
  //   try {
  //     return await this.agentService.generateContent(generateContentDto);
  //   } catch (error) {
  //     throw new HttpException(
  //       error.message || '生成内容失败',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // 古诗词生成快捷接口
  // @Post('poetry')
  // async generatePoetry(@Body() body: { prompt: string; options?: any }) {
  //   return this.agentService.generateContent({
  //     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  //     agentType: 'poetry' as any,
  //     prompt: body.prompt,
  //     options: body.options,
  //   });
  // }

  // 小红书文案生成快捷接口
  @Post('xiaohongshu')
  async generateXiaohongshu(@Body() body: { prompt: string; options?: any }) {
    return this.agentService.generateContent({
      agentType: 'xiaohongshu' as AgentType.XIAOHONGSHU,
      prompt: body.prompt,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      options: body.options,
    });
  }
}
