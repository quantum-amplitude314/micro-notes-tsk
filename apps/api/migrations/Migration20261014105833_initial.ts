import { Migration } from "@mikro-orm/migrations";

export class Migration20261014105833_initial extends Migration {
  override name = "Migration20261014105833_initial";

  override up(): void | Promise<void> {
    this.addSql(
      `create table \`notes\` (\`id\` varchar(36) not null, \`owner_id\` varchar(36) not null, \`title\` varchar(200) not null, \`content\` text not null, \`priority\` enum('low','medium','high') not null, \`created_at\` datetime(3) not null, \`updated_at\` datetime(3) not null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`,
    );
    this.addSql(`alter table \`notes\` add index \`notes_owner_id_index\` (\`owner_id\`);`);
  }

  override down(): void | Promise<void> {
    this.addSql(`drop table if exists \`notes\`;`);
  }
}
