export class Session {
  constructor(
    private readonly expiresAt: Date,
    private readonly user: unknown,
  ) {}

  isExpired() {
    return this.expiresAt < new Date();
  }
}
