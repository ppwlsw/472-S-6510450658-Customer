export interface AuthCookie {
    token : PlainText;
    user_id: string;
    role: string;
}

interface PlainText {
    plain_text: string;
}