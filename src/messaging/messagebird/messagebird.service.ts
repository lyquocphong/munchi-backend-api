import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initClient, MessageBird } from 'messagebird';

@Injectable()
export class MessageBirdService {

    messagebird: MessageBird;

    sourcePhoneNumber: string;

    constructor(private readonly configService: ConfigService) {
        const key = this.configService.getOrThrow<string>('messagebird.key');
        this.messagebird = initClient(key);
        this.sourcePhoneNumber = this.configService.getOrThrow<string>('messagebird.source_phone_number');
        console.log(this.sourcePhoneNumber, key)
    }

    /**
     * send voice message to bussiness to remind the order pending
     *
     * @param   {string}  businessPhone
     *
     * @return  {void}
     */
    remindOrderPending(businessPhone: string): void {
        const title = 'Pending Order';
        const message =
            'Hello! This is Munchi Support Calling here. You have a new order available in your Munchi ordering system. Please open the app to accept it. Thank you!';
        this.sendVoiceMessage(title, message, businessPhone);
    }

    /**
     * Send voice message
     *
     * @param   {string}            title
     * @param   {string}            message
     * @param   {string}            destination
     * @param   {CallableFunction}  callbackFn
     *
     * @return  {void}
     */
    sendVoiceMessage(title: string, message: string, destination: string, callbackFn?: CallableFunction): void {
        try {
            this.messagebird.calls.create(
                {
                    source: this.sourcePhoneNumber,
                    destination: destination,
                    callFlow: {
                        title,
                        steps: [
                            {
                                action: 'say',
                                options: {
                                    payload: message,
                                    language: 'en-gb',
                                    voice: 'female',
                                },
                            },
                        ],
                    },
                },
                (call) => {
                    console.log('Call info', call);
                    if (callbackFn) {
                        callbackFn();
                    }
                },
            );
        } catch (error) {
            console.log(error);
        }
        
    }
}