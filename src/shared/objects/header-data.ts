export class HeaderData {
  public constructor(public title: string, public canGoBack: boolean,
      public menuAvailable?: boolean, public menuOptions?: Array<string>) {
  }
}
