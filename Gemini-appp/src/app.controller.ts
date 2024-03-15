import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { AppService } from './app.service';
import { PromptBody } from './dto/prompt.dto';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private genAI: GoogleGenerativeAI;
  constructor(private readonly appService: AppService, private readonly config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(this.config.get("API_KEY"))
  }
  @Post('/analyze-sentence')
  async analyzeSentence(@Body('sentence') sentence: string[]): Promise<string> {
    /* const safetySettings = {
       [HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
       [HarmCategory.HARM_CATEGORY_HARASSMENT]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
       [HarmCategory.HARM_CATEGORY_HATE_SPEECH]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
       [HarmCategory.HARM_CATEGORY_UNSPECIFIED]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
       [HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT]: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
     };
     const evaluateSafety = (sentence) => {
       let isBlocked = false;
 
       // Tüm zarar kategorilerini kontrol etme
       for (const category in safetySettings) {
         const threshold = safetySettings[category];
 
         // Cümleyi kontrol etme
         console.log(`Güvenlik ayarı for ${category}: ${threshold}`);
 
         if (threshold === HarmBlockThreshold.BLOCK_ONLY_HIGH) {
           console.error(`Uyarı: ${category} kategorisinde yüksek güvenlik kısıtlamaları nedeniyle cümle engellendi.`);
           isBlocked = true;
         }
       }
 
       // Sonucu yazdırma
       if (isBlocked) {
         console.error("Cümle güvenli değil, bir veya daha fazla kategori yüksek güvenlik kısıtlamaları nedeniyle engellendi.");
       } else {
         console.log("Cümle güvenli, herhangi bir uyarı alınmadı.");
       }
     };
     evaluateSafety(" ")
 
 
 
     const safetyPrompt = Object.entries(safetySettings).reduce((acc, [category, threshold]) => {
       return `${acc} ${category}: ${threshold}`;
     }, '');
 */
    const prompt = `Yorumlarda argo, din, ırk ve cinsiyetçilik gibi unsurlardan kaçınılması, eleştirilerin yapıcı olması ve hastane uygulamasında yayımlanacak yorumların onaylanması ya da onaylanmaması isteniyor. Küfürlere ve belirli içeriklere tolerans gösterilirken, kişiye saldırı içermeyen argo kelimelerin kabul edilmesi bekleniyor.Argo ve küfürlere dikkat edilmesi isteniyor. Bu uygulamayı profesyonel sağlık çalışanları tarafından yapılmaası gerekmekterdir.Cümle uygun ise onaylıyorum ya da onaylamıyorum yaz eğer onaylamıyorsan nedenini açıkla.Cümleni veriyorum : ${sentence}`
    console.log(sentence);
    const result = await this.genAI.getGenerativeModel({ model: 'gemini-pro' }).generateContent(prompt);
    const response = await result.response;
    console.log(response.promptFeedback.safetyRatings[0].probability == "HIGH");

    return response.text();
  }
  /*
  @HttpCode(HttpStatus.OK)
  
  @Post("prompt")
  async getPromptResponse(@Body() body: PromptBody): Promise<string[]> {
    // Burada body.prompt bir tekil string değil, prompt'ları içeren bir dizi olacaktır
    const responses = await this.appService.getPromptResponses(body.prompt); // Plural "prompts" kullanın
    return responses;
  }*/
}
