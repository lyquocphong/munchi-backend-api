import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TelegramClient, TelegramTypes } from 'messaging-api-telegram';

const EMOJI_FIRE = '\u{1F525}';
const EMOJI_CHECK = '\u{2705}';

@Injectable()
export class TelegramService {

    /**
     * This client is used to send message to telegram
     * 
     * @type {TelegramClient}
     */
    telegramClient: TelegramClient;

    constructor(private readonly configService: ConfigService) {

        let accessToken = this.configService.getOrThrow<string>('telegram.bot_key');

        this.telegramClient = new TelegramClient({ accessToken });
    }

    /**
     * Send success message to telegram
     *
     * @param   {string}  message
     *
     * @return  {void}
     */
    sendSuccessMessage(message: string): void {
        message = EMOJI_CHECK + ' ' + message + '\n';
        this.sendMessage(message);
    }

    /**
     * Send danger message to telegram
     *
     * @param   {string}  message
     *
     * @return  {void}
     */
    sendDangerMessage(message: string): void {
        message = EMOJI_FIRE + ' ' + message + '\n';
        this.sendMessage(message);
    }

    /**
     * Send telegram message
     *
     * @param   {string}  message
     *
     * @return  {void}
     */
    private sendMessage(message: string): void {
        const appEnvironment = this.configService.get<string>('app.environment');
        let sendMessage = '---------------------------------\n';
        sendMessage += appEnvironment + '\n';
        sendMessage += '---------------------------------\n';
        sendMessage += message + '\n';
        sendMessage += '---------------------------------\n';

        let chatId = this.configService.get<string>('telegram.chat_id');

        this.telegramClient
            .sendMessage(`-${chatId}`, sendMessage, {
                parseMode: TelegramTypes.ParseMode.HTML,
            })
            .then(() => {
                console.log('sent telegram');
            });
    }
}