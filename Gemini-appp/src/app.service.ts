import { GoogleGenerativeAI } from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';



@Injectable()
export class AppService {
  private genAI: any
  private genAiProModel: any
  private genAiProImage: any
  constructor(private readonly config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"));
    this.genAiProModel = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.genAiProImage = this.genAI.getGenerativeModel({ model: 'gemini-pro-vision' })
  }
  getHello(): string {
    //this.config.get("API_KEY")
    return 'Hello World!';
  }
  async getPromptResponses(prompt: string): Promise<string[]> {


    const result = await this.genAiProModel.generateContent(prompt);
    const response = await result.response;



    return response.text();
  }

  async analyzeSentence(sentence: string) {
    const prompt = `Hastane uygulamalarında yapılan yorumlarda, cinsel içerikli veya küfürlü ifadeleri engellerken olumlu ve uygun cevapları reddetmeyin. Lütfen, içeriği dengeli bir şekilde değerlendirin. Bir hastane uygulamasının sayfasında böyle yorum görmek sakıncalı mı? değil mi ? "${sentence}"`
    const response = await this.getPromptResponses(prompt)
    console.log(`Cümle analizi : ${response}`);
  }
}
