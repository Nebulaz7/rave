import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../common/supabase.service';

@Injectable()
export class RoadmapService {
  constructor(private readonly supabaseService: SupabaseService) {}

  async create(userId: string, title: string, goal: string, roadmap: any) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('roadmaps')
      .insert([{ user_id: userId, title, goal, roadmap }])
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  }

  async findAllByUser(userId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('roadmaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data;
  }

  async findOne(id: string, userId: string) {
    const client = this.supabaseService.getClient();
    const { data, error } = await client
      .from('roadmaps')
      .select('*')
      .eq('id', id)
      .or(`user_id.eq.${userId},is_public.eq.true`)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data;
  }

  async delete(id: string, userId: string) {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('roadmaps')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return { success: true };
  }

  async togglePublic(id: string, userId: string, isPublic: boolean) {
    const client = this.supabaseService.getClient();
    const { error } = await client
      .from('roadmaps')
      .update({ is_public: isPublic })
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return { success: true };
  }
}
