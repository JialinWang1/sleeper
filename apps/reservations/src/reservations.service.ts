import { ReservationRepository } from './reservations.repository'
import { Inject, Injectable } from '@nestjs/common'
import { CreateReservationDto } from './dto/create-reservation.dto'
import { UpdateReservationDto } from './dto/update-reservation.dto'
import { PAYMENT_SERVICE, User } from '@app/common'
import { ClientProxy } from '@nestjs/microservices'
import { map } from 'rxjs'
import { Reservation } from './models/reservation.entity'

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    @Inject(PAYMENT_SERVICE) private readonly paymentsService: ClientProxy
  ) {}

  async create(createReservationDto: CreateReservationDto, { email, id: userId }: User) {
    return this.paymentsService
      .send('create_charge', {
        ...createReservationDto.charge,
        email
      })
      .pipe(
        map(async (res) => {
          const reservation = new Reservation({
            ...createReservationDto,
            invoiceId: res.id,
            timestamp: new Date(),
            userId
          })
          return await this.reservationRepository.create(reservation)
        })
      )
  }

  findAll() {
    return this.reservationRepository.find({})
  }

  findOne(id: number) {
    return this.reservationRepository.findOne({ id })
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return this.reservationRepository.findOneAndUpdate({ id }, updateReservationDto)
  }

  remove(id: number) {
    return this.reservationRepository.findOneAndDelete({ id })
  }
}
