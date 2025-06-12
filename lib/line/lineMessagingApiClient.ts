import * as line from '@line/bot-sdk';

export const lineClient = new line.messagingApi.MessagingApiClient({
	channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN ?? '',
});
line.middleware({
	channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET ?? '',
});
