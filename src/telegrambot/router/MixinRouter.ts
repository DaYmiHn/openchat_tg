import { MainMenuRouter } from '@telegrambot/router/parts//MainMenuRouter';
import { AiRouter } from '@telegrambot/router/parts//AiRouter';

const routers = [AiRouter, MainMenuRouter];

function mixin(routers) {
  routers.forEach((router) => {
    Object.getOwnPropertyNames(router.prototype).forEach((name) => {
      routers[0].prototype[name] = router.prototype[name];
    });
  });
  return routers[0];
}

export class MixinRouter extends mixin(routers) {
  public routers = routers;
}
