export interface CreateSessionCommand{
    communityId: string;
    userId: string;
    channelId: string;
}

export interface AcceptOfferCommand {
    sessionToken: string;
    offerSdp: any;
}

export interface AcceptAnswerCommand {
    sessionToken: string;
    answerSdp: any;
}

