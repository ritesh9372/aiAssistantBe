import { KnowledgeItem, Brand } from '../types/conversation';

export class KnowledgeBaseRepository {
  public brands: Brand[] = [
    { id: 'brand-core', name: 'Apex Retail', category: 'Consumer Products & E-Commerce' },
    { id: 'brand-glow', name: 'GlowBotanics Skincare', category: 'Beauty & Skincare' },
    { id: 'brand-aerofit', name: 'AeroFit Nutrition', category: 'Health & Supplements' }
  ];

  private knowledgeItems: KnowledgeItem[] = [
    // Standard Company Knowledge Base Articles (Assessment Requirements)
    {
      id: 'kb-refund-01',
      brandId: 'brand-core',
      category: 'refund',
      title: 'Refund Policy',
      content: 'Customers can request a refund within 7 days of purchase. Refund requests are reviewed before approval. Once approved, refunds are credited back to your original payment method within 3-5 business days.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-ship-01',
      brandId: 'brand-core',
      category: 'shipping',
      title: 'Shipping Policy',
      content: 'Standard shipping usually takes 3-5 business days.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-cancel-01',
      brandId: 'brand-core',
      category: 'cancellation',
      title: 'Order Cancellation Policy',
      content: 'Orders can be cancelled before they are shipped.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-premium-01',
      brandId: 'brand-core',
      category: 'return',
      title: 'Premium Customer Support',
      content: 'Premium customers receive priority customer support.',
      updatedAt: new Date().toISOString()
    },

    // GlowBotanics Skincare Brand Policies
    {
      id: 'kb-glow-01',
      brandId: 'brand-glow',
      category: 'refund',
      title: 'Refund & Damaged Item Policy',
      content: 'Refunds are strictly permitted within 7 days of delivery. For damaged goods (such as broken glass bottles or defective pumps), customers must submit clear photographic proof within 48 hours of delivery to qualify for an immediate free replacement or full refund to the original payment method. Once issued, refunds take 3 to 5 business days to reflect in your account depending on your bank.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-glow-02',
      brandId: 'brand-glow',
      category: 'return',
      title: 'Return Policy',
      content: 'Only unopened skincare items in original tamper-evident packaging can be returned within 14 days of delivery. Opened cosmetic or serum products cannot be returned due to hygiene and health regulations.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-glow-03',
      brandId: 'brand-glow',
      category: 'shipping',
      title: 'Shipping & Delivery Policy',
      content: 'Standard shipping takes 3-5 business days. Express shipping delivers in 1-2 business days. Fragile glass items are shipped in eco-friendly protective bubble wrap. Free shipping on orders over $50.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-glow-04',
      brandId: 'brand-glow',
      category: 'cancellation',
      title: 'Order Cancellation Policy',
      content: 'Orders can only be modified or cancelled within 1 hour of placement before they enter automated warehouse batch fulfillment.',
      updatedAt: new Date().toISOString()
    },

    // AeroFit Nutrition Brand Policies
    {
      id: 'kb-aero-01',
      brandId: 'brand-aerofit',
      category: 'refund',
      title: '30-Day Money-Back & Damaged Bottle Guarantee',
      content: 'AeroFit offers a 30-day 100% satisfaction guarantee. If your shaker, powder container, or supplement bottle arrives broken or unsealed, we issue an instant full refund or free priority replacement immediately—no photo or return required.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-aero-02',
      brandId: 'brand-aerofit',
      category: 'return',
      title: 'Generous Return Policy',
      content: 'Customers may return supplement products within 30 days of delivery, even if the tub has been opened and tested up to 50% of the volume. Return shipping labels are pre-paid by AeroFit.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-aero-03',
      brandId: 'brand-aerofit',
      category: 'shipping',
      title: 'Same-Day Dispatch & Delivery Policy',
      content: 'Orders placed before 2 PM EST ship same-day via FedEx Ground (2-4 business days). Expedited overnight delivery is available at checkout.',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'kb-aero-04',
      brandId: 'brand-aerofit',
      category: 'cancellation',
      title: 'Flexible Cancellation Policy',
      content: 'Orders can be cancelled anytime prior to shipping notification without any cancellation penalty or fee.',
      updatedAt: new Date().toISOString()
    }
  ];

  async getBrands(): Promise<Brand[]> {
    return this.brands;
  }

  async getAll(brandId?: string): Promise<KnowledgeItem[]> {
    if (brandId && brandId !== 'all') {
      // If brand is specific, return that brand's policies PLUS core fallback policies
      const brandItems = this.knowledgeItems.filter((k) => k.brandId === brandId);
      if (brandItems.length > 0) return brandItems;
    }
    return this.knowledgeItems;
  }

  async getById(id: string): Promise<KnowledgeItem | null> {
    const item = this.knowledgeItems.find((k) => k.id === id);
    return item ? { ...item } : null;
  }

  async create(data: Omit<KnowledgeItem, 'id' | 'updatedAt'>): Promise<KnowledgeItem> {
    const newItem: KnowledgeItem = {
      ...data,
      id: `kb-${Date.now()}`,
      updatedAt: new Date().toISOString()
    };
    this.knowledgeItems.unshift(newItem);
    return newItem;
  }

  async update(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem | null> {
    const idx = this.knowledgeItems.findIndex((k) => k.id === id);
    if (idx === -1) return null;
    this.knowledgeItems[idx] = {
      ...this.knowledgeItems[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.knowledgeItems[idx];
  }

  async delete(id: string): Promise<boolean> {
    const initialLen = this.knowledgeItems.length;
    this.knowledgeItems = this.knowledgeItems.filter((k) => k.id !== id);
    return this.knowledgeItems.length < initialLen;
  }
}

export const knowledgeBaseRepository = new KnowledgeBaseRepository();
