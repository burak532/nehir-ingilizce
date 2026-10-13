/** Uygulama her açıldığında (sayfa yüklendiğinde) yeni bir oturum kimliği oluşturulur. */
export const sessionId: string = crypto.randomUUID();
export const sessionStartedAt: number = Date.now();
