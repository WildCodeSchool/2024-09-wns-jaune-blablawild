import { BaseFactory, FactoryOptions } from "../baseFactory";
import { NewUserInput } from "../../userResolver";

// La factory hérite de BaseFactory avec le type NewUserInput
export class UserInputFactory extends BaseFactory<NewUserInput> {
  protected defineEntity(): NewUserInput {
    const firstName = this.faker.person.firstName();
    const lastName = this.faker.person.lastName();
    
    return {
      firstname: firstName,
      lastname: lastName,
      email: this.faker.internet.email({ firstName, lastName }),
      password: "password123",
    };
  }

  // Comme NewUserInput n'est pas une entité avec une méthode save(),
  // nous implémentons une version simplifiée de persist qui retourne juste l'entité
  protected async persist(entity: NewUserInput): Promise<NewUserInput> {
    // Pour les objets d'entrée, pas besoin de simulation d'enregistrement
    // On retourne simplement l'objet tel quel
    return entity;
  }
  
  // Méthodes utilitaires spécifiques aux objets d'entrée
  withSpecificEmail(email: string): this {
    // On stocke l'email pour la prochaine construction
    return this.withOverride({ email });
  }
  
  withSpecificPassword(password: string): this {
    return this.withOverride({ password });
  }
  
  // Méthode helper pour stocker les overrides à appliquer
  private _overrides: Partial<NewUserInput> = {};
  
  withOverride(override: Partial<NewUserInput>): this {
    this._overrides = { ...this._overrides, ...override };
    return this;
  }
  
  // Surcharger build pour appliquer les overrides stockés
  async build(options: FactoryOptions<NewUserInput> = {}): Promise<NewUserInput> {
    // Fusionner les overrides stockés avec ceux fournis en paramètre
    const mergedOptions = {
      ...options,
      override: {
        ...this._overrides,
        ...options.override
      }
    };
    
    // Réinitialiser les overrides pour les futurs appels
    this._overrides = {};
    
    // Appeler la méthode build de la classe parente
    return super.build(mergedOptions);
  }
}

// Instance exportée pour faciliter l'utilisation
export const userInputFactory = new UserInputFactory();