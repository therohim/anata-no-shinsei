import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../schema/user.schema';
import { UserRepository } from '../repository/user.repostory';
import { UpdateUserProfileDto } from '../dto/update-user-request.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  private zodiacSigns = [
    { sign: 'Aries', start: '03-21', end: '04-19' },
    { sign: 'Taurus', start: '04-20', end: '05-20' },
    { sign: 'Gemini', start: '05-21', end: '06-21' },
    { sign: 'Cancer', start: '06-22', end: '07-22' },
    { sign: 'Leo', start: '07-23', end: '08-22' },
    { sign: 'Virgo', start: '08-23', end: '09-22' },
    { sign: 'Libra', start: '09-23', end: '10-23' },
    { sign: 'Scorpio', start: '10-24', end: '11-21' },
    { sign: 'Sagittarius', start: '11-22', end: '12-21' },
    { sign: 'Capricorn', start: '12-22', end: '01-19' },
    { sign: 'Aquarius', start: '01-20', end: '02-18' },
    { sign: 'Pisces', start: '02-19', end: '03-20' },
  ];


  async create(createUserDto: any): Promise<User> {
    createUserDto.password = await this.hashPassword(createUserDto.password);

    const createdUser = await this.userRepository.create(createUserDto);
    return createdUser;
  }

  async findAll(q: any): Promise<User[]> {
    return await this.userRepository.findAll(q);
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepository.findAllUsers()
  }

  async findUserByEmailOrUsername(email: string): Promise<User> {
    return await this.userRepository.findUserByEmailOrUsername(email);
  }

  async findUserByEmail(email: string): Promise<User> {
    return await this.userRepository.findUserByEmail(email);
  }

  async findUserByPhone(phone: string): Promise<User> {
    return await this.userRepository.findUserByPhone(phone);
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findUserByUsername(username);
  }

  async updateOne(userId: string, data: UpdateUserProfileDto): Promise<any> {
    return await this.userRepository.updateOne(userId, data);
  }

  async findById(userId: string): Promise<User> {
    return await this.userRepository.findById(userId);
  }
  
  async hashPassword(data: string) {
    return bcrypt.hash(data, 10);
  }

  getZodiacSign(month: number, day: number): string {
    console.log(month)
    const date = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    for (const zodiac of this.zodiacSigns) {
      if (date >= zodiac.start && date <= zodiac.end) {
        return zodiac.sign;
      }
    }
    // If the date is in January, it should check against Capricorn
    return month === 1 ? 'Capricorn' : 'Pisces';
  }

  getHoroscope(sign: string): string {
    // Dummy horoscopes, replace with real ones
    const horoscopes = {
      Aries: 'Today is a great day for new beginnings.',
      Taurus: 'Patience and persistence will bring success.',
      Gemini: 'Embrace the duality within you.',
      Cancer: 'Nurture your relationships today.',
      Leo: 'Your charisma will attract positive attention.',
      Virgo: 'Focus on organization and details.',
      Libra: 'Seek balance in all areas of life.',
      Scorpio: 'Transformation is on the horizon.',
      Sagittarius: 'Adventure awaits you.',
      Capricorn: 'Hard work will pay off.',
      Aquarius: 'Innovate and think outside the box.',
      Pisces: 'Let your creativity flow.',
    };
    return horoscopes[sign] || 'No horoscope available for this sign.';
  }

}
