
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
import { CheckoutSession, CreateCheckoutSessionInput } from '../entities/checkout'
import { Trip } from '../entities/trip';
import { User } from '../entities/user';
import { GraphQLError } from 'graphql';
import { Transaction } from '../entities/transaction';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const port = process.env.GATEWAY_PORT

@Resolver()
export class TransactionResolver {
    @Mutation(() => CheckoutSession)
    async createCheckoutSession(
        @Arg("input") input: CreateCheckoutSessionInput,
        @Ctx() context: any 
    ): Promise<CheckoutSession> {
        try {
            const {
                price,
                currency,
                method,
                tripId,
                receiverId,
                senderId,
                customerEmail,
                metadata = {}
            } = input;

            const trip = await Trip.findOne({ where: { id: tripId }});
            if (!trip) {
                throw new GraphQLError("Trajet non trouvé", {
                    extensions: {
                        code: "TRIP_NOT_FOUND",
                        field: "tripId"
                    }
                });
            }

            const receiver = await User.findOne({ where: {id: receiverId}})
            if (!receiver) {
                throw new GraphQLError("Utilisateur non trouvé", {
                    extensions: {
                        code: "RECEIVER_NOT_FOUND",
                        field: "receiverId"
                    }
                });
            }

            const sender = await User.findOne({ where: {id: senderId}})
            if (!sender) {
                throw new GraphQLError("Utilisateur non trouvé", {
                    extensions: {
                        code: "SENDER_NOT_FOUND",
                        field: "senderId"
                    }
                });
            }

            const transaction = new Transaction();
            transaction.status = "pending";
            transaction.createdAt = new Date();
            transaction.price = price;
            transaction.method = method;
            transaction.trip = trip;
            transaction.receiver = receiver;
            transaction.sender = sender;
    

            await transaction.save();

            const successUrl = `http://localhost:${port}/payment/success?session_id={CHECKOUT_SESSION_ID}&transaction_id=${transaction.id}`;
            const cancelUrl = `http://localhost:${port}/payment/cancel?transaction_id=${transaction.id}`;


            const sessionConfig:any = {
                payment_method_types: ['card'],
                line_items: [{
                    price_data: {
                        currency: currency.toLowerCase(),
                        product_data: {
                            name: `Paiement pour voyage - ${trip.arrival_city}`,
                            description: `Transaction entre ${sender.firstname} ${sender.lastname} et ${receiver.firstname} ${receiver.lastname}`
                        },
                        unit_amount: Math.round(price * 100),
                    },
                    quantity: 1,
                }],
                mode: 'payment',
                success_url: successUrl,
                cancel_url: cancelUrl,
                metadata: {
                    ...metadata,
                    transactionId: transaction.id,
                    tripId,
                    receiverId,
                    senderId,
                    timestamp: new Date().toISOString(),
                },
                expires_at: Math.floor(Date.now() / 1000) + (30 * 60)
            }
            

            if (customerEmail) {
                sessionConfig.customer_email = customerEmail;
            }
            
            console.log()
            const session = await stripe.checkout.sessions.create(sessionConfig);

            transaction.stripe_session_id = session.id;
            await transaction.save()

            console.log(`[${new Date().toISOString()}] Checkout session créée: ${session.id} pour transaction ${transaction.id}`);

            return {
                sessionId: session.id,
                url: session.url!,
                expiresAt: session.expires_at!,
                success: true,
                message: 'Session de paiement créée avec succès',
                transactionId: transaction.id
            };
            
        } catch (error: any) {
            console.error(`[${new Date().toISOString()}] Erreur checkout:`, error);

            if (error instanceof Stripe.errors.StripeError) {
                if (error.type === 'StripeCardError') {
                    throw new GraphQLError('Erreur de carte de paiement', {
                        extensions: {
                            code: 'STRIPE_CARD_ERROR',
                            details: error.message
                        }
                    })
                }

                if (error.type === 'StripeInvalidRequestError') {
                    throw new GraphQLError('Paramètres de requête invalides', {
                        extensions: {
                            code: 'STRIPE_INVALID_REQUEST',
                            details: error.message
                        }
                    })
                }

                throw new GraphQLError('Erreur du service de paiement', {
                    extensions: { code: 'STRIPE_ERROR' }
                    });
            }

            if (error instanceof GraphQLError) {
                throw error;
            }

            throw new GraphQLError('Erreur interne lors de la création de la session', {
                extensions: { code: 'INTERNAL_ERROR' }
            });
        }
    }

    @Query(() => Transaction, { nullable: true })
    async getTransactionBySessionId(
        @Arg("sessionId") sessionId: string
    ): Promise<Transaction | null> {
        return await Transaction.findOne({
            where: { stripe_session_id: sessionId },
            relations: ["trip", "receiver", "sender"]
        });
    }
}