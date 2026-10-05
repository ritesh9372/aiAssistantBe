import { Conversation, ConversationDetail, Message } from '../types/conversation';

export interface IConversationRepository {
  getAll(): Promise<Conversation[]>;
  getById(id: string): Promise<ConversationDetail | null>;
  addMessage(conversationId: string, sender: 'customer' | 'agent', text: string): Promise<ConversationDetail | null>;
}

class ConversationRepository implements IConversationRepository {
  private conversations: ConversationDetail[] = [
    // Flagship Demo Scenario (Assessment Core Requirement)
    {
      id: 'conv-001',
      brandId: 'brand-core',
      brandName: 'Apex Retail',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.in',
      status: 'pending',
      priority: 'high',
      lastMessage: "Hi, I purchased this product 3 days ago and I don't need it anymore. Can I get a refund?",
      orderInfo: {
        orderId: 'ORD-7749',
        item: 'Wireless Noise-Cancelling Headphones',
        orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: 'Delivered 3 days ago',
        status: 'delivered',
        totalAmount: '₹2,499'
      },
      updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-001',
          sender: 'customer',
          message: "Hi, I purchased this product 3 days ago and I don't need it anymore. Can I get a refund?",
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        }
      ]
    },

    // Scenario: Broken Bottle on Delivery (GlowBotanics Skincare - requires photo proof within 48h)
    {
      id: 'conv-002',
      brandId: 'brand-glow',
      brandName: 'GlowBotanics Skincare',
      customerName: 'Priya Patel',
      customerEmail: 'priya.patel@example.in',
      status: 'pending',
      priority: 'high',
      lastMessage: 'My order was delivered but the bottle is broken. What can I do?',
      orderInfo: {
        orderId: 'ORD-GLOW-7821',
        item: 'Radiance Vitamin C Serum (50ml Glass Dropper)',
        orderDate: '2026-10-01T09:15:00Z',
        deliveryDate: '2026-10-03T14:30:00Z (Delivered Yesterday)',
        status: 'delivered',
        totalAmount: '₹1,299'
      },
      updatedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-101',
          sender: 'customer',
          message: 'Hi, my order was delivered but the bottle is broken. What can I do?',
          timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString()
        }
      ]
    },

    // Scenario: Shipping Timeline Inquiry
    {
      id: 'conv-003',
      brandId: 'brand-core',
      brandName: 'Apex Retail',
      customerName: 'Rohan Verma',
      customerEmail: 'rohan.verma@example.in',
      status: 'pending',
      priority: 'medium',
      lastMessage: 'How long does standard shipping usually take to arrive?',
      orderInfo: {
        orderId: 'ORD-9912',
        item: 'Smart Fitness Tracker Band',
        orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        deliveryDate: 'In Transit',
        status: 'shipped',
        totalAmount: '₹1,899'
      },
      updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-301',
          sender: 'customer',
          message: 'How long does standard shipping usually take to arrive?',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        }
      ]
    },

    // Scenario: Out of Policy Guardrail Test (Refund after 20 days on 7-day policy)
    {
      id: 'conv-004',
      brandId: 'brand-core',
      brandName: 'Apex Retail',
      customerName: 'Ananya Iyer',
      customerEmail: 'ananya.iyer@example.in',
      status: 'pending',
      priority: 'medium',
      lastMessage: 'I received this 20 days ago. Can I get a refund?',
      orderInfo: {
        orderId: 'ORD-6102',
        item: 'Ergonomic Desk Keyboard',
        orderDate: '2026-09-12T14:20:00Z',
        deliveryDate: '2026-09-14T11:00:00Z (20 days ago)',
        status: 'delivered',
        totalAmount: '₹3,199'
      },
      updatedAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'msg-401',
          sender: 'customer',
          message: 'I received this 20 days ago. Can I get a refund?',
          timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString()
        }
      ]
    }
  ];

  async getAll(): Promise<Conversation[]> {
    return this.conversations.map(({ messages: _, ...rest }) => ({ ...rest }));
  }

  async getById(id: string): Promise<ConversationDetail | null> {
    const found = this.conversations.find((c) => c.id === id);
    return found ? JSON.parse(JSON.stringify(found)) : null;
  }

  async addMessage(
    conversationId: string,
    sender: 'customer' | 'agent',
    text: string
  ): Promise<ConversationDetail | null> {
    const conv = this.conversations.find((c) => c.id === conversationId);
    if (!conv) return null;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender,
      message: text,
      timestamp: new Date().toISOString()
    };

    conv.messages.push(newMessage);
    conv.lastMessage = text;
    conv.updatedAt = new Date().toISOString();

    if (sender === 'customer') {
      conv.status = 'pending';
    } else {
      conv.status = 'active';
    }

    return JSON.parse(JSON.stringify(conv));
  }
}

export const conversationRepository = new ConversationRepository();
