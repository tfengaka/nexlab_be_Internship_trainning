import { Column, CreatedAt, DataType, Model, Table, UpdatedAt } from 'sequelize-typescript';

export interface IEventLogAttributes {
  id: string;
  type: string;
  status: Status;
  metadata: object;
  respone: object;
}

@Table({ tableName: 'event_logs' })
class EventLog extends Model<IEventLogAttributes> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  public type!: string;

  @Column({
    type: DataType.TEXT,
    defaultValue: 'pending',
  })
  public status!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  public metadata!: object;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  public respone!: object;

  @CreatedAt
  created_at!: Date;

  @UpdatedAt
  updated_at!: Date;
}

export default EventLog;
