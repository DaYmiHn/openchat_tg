import { Logger } from '@nestjs/common';

const DecoratorsFabric = (type: string) => {
  const logger = new Logger(`TelegramBot`);

  return (name: string): any => {
    return (target: any, _: string, descriptor: PropertyDescriptor) => {
      const controllerClass = target.constructor;
      const routers = Reflect.hasMetadata(type, controllerClass)
        ? Reflect.getMetadata(type, controllerClass)
        : [];
      logger.log(`Mapped {${name}, ${type}}`);
      routers.push({
        name,
        descriptor,
      });
      Reflect.defineMetadata(type, routers, target.constructor);
      return descriptor;
    };
  };
};

export const Callback = DecoratorsFabric('callback');
export const Waiting = DecoratorsFabric('waiting');
export const Message = DecoratorsFabric('message');

export const getMetadataFromMixin = (name: string, descriptors: any) => {
  const res = descriptors.flatMap((descriptor) =>
    Reflect.getMetadata(name, descriptor),
  );
  return res.filter(e => !!e);
};
