export default interface ChatList {
    user_chat: number, 
    last_message: Date, 
    first_name: string,
    middle_name?: string | null,
    last_name: string
}