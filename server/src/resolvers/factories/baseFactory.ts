import { faker } from "@faker-js/faker";

// definit les options que l'on peut passer a nos factories
export interface FactoryOptions<T> {
  override?: Partial<T>; // remplacer ou rajouter proprietes de l'objet
  count?: number; // creer plusieurs objects
}

export abstract class BaseFactory<T> {
  protected faker = faker;

  // Methode pour creer un object sans l enregister en base
  async build(options: FactoryOptions<T> = {}): Promise<T> {
    const entity = this.defineEntity();

    if (options.override) {
      return { ...entity, ...options.override };
    }
    return entity
  }

  async create(options: FactoryOptions<T> = {}): Promise<T> {
    const entity = await this.build(options);

    return this.persist(entity);
  }

  // MÉTHODE ABSTRAITE: chaque classe enfant doit implémenter cette méthode
  // Elle définit comment créer l'entité avec des données par défaut
  protected abstract defineEntity(): T;

  // defini comment simuler l'enregistrement 
  protected abstract persist(entity: T): Promise<T>;
}
