import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { RoleCode } from '../common/enums/role-code.enum';
import { User } from '../entities/user.entity';
import { UserStatus } from '../common/enums/user-status.enum';
import * as bcrypt from 'bcrypt';
import { Category } from '../entities/category.entity';
import { Designer } from '../entities/designer.entity';
import { DownloadableFile } from '../entities/downloadable-file.entity';
import { Visibility } from '../common/enums/visibility.enum';
import { Product } from '../entities/product.entity';
import { Catalogue } from '../entities/catalogue.entity';
import { NewsPost } from '../entities/news-post.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Designer)
    private readonly designerRepository: Repository<Designer>,
    @InjectRepository(DownloadableFile)
    private readonly fileRepository: Repository<DownloadableFile>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Catalogue)
    private readonly catalogueRepository: Repository<Catalogue>,
    @InjectRepository(NewsPost)
    private readonly newsRepository: Repository<NewsPost>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedAdmin();
    await this.seedCategories();
    await this.seedDesigners();
    await this.seedFiles();
    await this.seedProducts();
    await this.seedCatalogues();
    await this.seedNews();
  }

  private async seedRoles() {
    const count = await this.roleRepository.count();
    if (count > 0) {
      return;
    }

    const roles = [
      { code: RoleCode.ADMIN, name: 'Administrator' },
      { code: RoleCode.AUTHORIZED_DEALER, name: 'Authorized Dealer' },
      { code: RoleCode.ARCHITECT, name: 'Architect' },
      { code: RoleCode.PRESS, name: 'Press' },
    ];

    await this.roleRepository.save(roles);
    this.logger.log('Seeded roles.');
  }

  private async seedAdmin() {
    const count = await this.userRepository.count();
    if (count > 0) {
      return;
    }

    const adminRole = await this.roleRepository.findOneOrFail({
      where: { code: RoleCode.ADMIN },
    });

    const passwordHash = await bcrypt.hash(
      process.env.ADMIN_PASSWORD ?? 'Admin123!@#',
      10,
    );

    const admin = this.userRepository.create({
      email: process.env.ADMIN_EMAIL ?? 'admin@bowen.local',
      passwordHash,
      fullName: 'Bowen Admin',
      status: UserStatus.ACTIVE,
      role: adminRole,
    });

    await this.userRepository.save(admin);
    this.logger.log('Seeded default admin user.');
  }

  private async seedCategories() {
    const count = await this.categoryRepository.count();
    if (count > 0) {
      return;
    }

    const indoorRoot = this.categoryRepository.create({
      slug: 'indoor',
      nameKa: 'ინტერიერი',
      nameEn: 'Indoor',
      domain: 'indoor',
    });

    const outdoorRoot = this.categoryRepository.create({
      slug: 'outdoor',
      nameKa: 'ექსტერიერი',
      nameEn: 'Outdoor',
      domain: 'outdoor',
    });

    await this.categoryRepository.save([indoorRoot, outdoorRoot]);

    const indoorChildren = [
      ['sofas-indoor', 'დივნები', 'Sofas'],
      ['armchairs-indoor', 'სავარძლები', 'Armchairs'],
      [
        'tables-writing-desks-indoor',
        'მაგიდები და სამუშაო მაგიდები',
        'Tables and Writing Desks',
      ],
      ['coffee-tables-indoor', 'ჟურნალის მაგიდები', 'Coffee Tables'],
      ['beds-indoor', 'საწოლები', 'Beds'],
      ['rugs-indoor', 'ხალიჩები', 'Rugs'],
    ];

    const outdoorChildren = [
      ['sofas-outdoor', 'გარე დივნები', 'Outdoor Sofas'],
      ['sunloungers-outdoor', 'შეზლონგები', 'Sunloungers'],
      ['tables-outdoor', 'გარე მაგიდები', 'Outdoor Tables'],
      ['armchairs-outdoor', 'გარე სავარძლები', 'Outdoor Armchairs'],
    ];

    const categories = [
      ...indoorChildren.map(([slug, nameKa, nameEn]) =>
        this.categoryRepository.create({
          slug,
          nameKa,
          nameEn,
          domain: 'indoor',
          parent: indoorRoot,
        }),
      ),
      ...outdoorChildren.map(([slug, nameKa, nameEn]) =>
        this.categoryRepository.create({
          slug,
          nameKa,
          nameEn,
          domain: 'outdoor',
          parent: outdoorRoot,
        }),
      ),
    ];

    await this.categoryRepository.save(categories);
    this.logger.log('Seeded categories.');
  }

  private async seedDesigners() {
    const count = await this.designerRepository.count();
    if (count > 0) {
      return;
    }

    const designers = [
      {
        slug: 'nino-meskhi',
        name: 'Nino Meskhi',
        bioKa:
          'ნინო მეშხი ქმნის თანამედროვე საცხოვრებელი სივრცეების ავეჯს, სადაც ქართული ოსტატობა და მინიმალისტური ხაზები ერთიანდება.',
        bioEn:
          'Nino Meskhi creates contemporary living furniture where Georgian craft meets minimalist lines.',
        photoPath: '/static/images/designer-nino.svg',
      },
      {
        slug: 'giorgi-kapanadze',
        name: 'Giorgi Kapanadze',
        bioKa:
          'გიორგი კაპანაძე მუშაობს მასალების ტაქტილურობასა და ფორმის სისუფთავეზე, განსაკუთრებით soft seating კოლექციებში.',
        bioEn:
          'Giorgi Kapanadze focuses on tactile materials and clean form language, especially in soft seating collections.',
        photoPath: '/static/images/designer-giorgi.svg',
      },
      {
        slug: 'salome-beridze',
        name: 'Salome Beridze',
        bioKa:
          'სალომე ბერიძე აერთიანებს არქიტექტურულ აზროვნებას და საცხოვრებელი ინტერიერის პრაქტიკულობას.',
        bioEn:
          'Salome Beridze combines architectural thinking with practical residential interior needs.',
        photoPath: '/static/images/designer-salome.svg',
      },
    ];

    await this.designerRepository.save(designers);
    this.logger.log('Seeded designers.');
  }

  private async seedFiles() {
    const count = await this.fileRepository.count();
    if (count > 0) {
      return;
    }

    const files = [
      {
        titleKa: 'Bowen Living კატალოგი 2026',
        titleEn: 'Bowen Living Catalogue 2026',
        fileType: 'catalogue_pdf',
        localPath: '/static/pdfs/bowen-living-2026.pdf',
        s3Key: 'catalogues/bowen-living-2026.pdf',
        visibility: Visibility.PUBLIC,
      },
      {
        titleKa: 'Bowen Outdoor კატალოგი 2026',
        titleEn: 'Bowen Outdoor Catalogue 2026',
        fileType: 'catalogue_pdf',
        localPath: '/static/pdfs/bowen-outdoor-2026.pdf',
        s3Key: 'catalogues/bowen-outdoor-2026.pdf',
        visibility: Visibility.DEALER_ARCHITECT,
      },
      {
        titleKa: 'Aura Sofa ტექნიკური ფაილი',
        titleEn: 'Aura Sofa Technical Sheet',
        fileType: 'technical_pdf',
        localPath: '/static/pdfs/aura-sofa-tech-sheet.pdf',
        s3Key: 'technical/aura-sofa-tech-sheet.pdf',
        visibility: Visibility.DEALER_ARCHITECT,
      },
      {
        titleKa: 'Press მაღალი რეზოლუციის ფოტოები',
        titleEn: 'Press High Resolution Photos',
        fileType: 'photo_archive',
        localPath: '/static/pdfs/press-photo-archive.pdf',
        s3Key: 'press/press-photo-archive.pdf',
        visibility: Visibility.PRESS_ONLY,
      },
    ];

    await this.fileRepository.save(files);
    this.logger.log('Seeded downloadable files.');
  }

  private async seedProducts() {
    const count = await this.productRepository.count();
    if (count > 0) {
      return;
    }

    const categories = await this.categoryRepository.find();
    const designers = await this.designerRepository.find();
    const files = await this.fileRepository.find();

    const categoryBySlug = Object.fromEntries(
      categories.map((category) => [category.slug, category]),
    );
    const designerBySlug = Object.fromEntries(
      designers.map((designer) => [designer.slug, designer]),
    );
    const fileByType = Object.fromEntries(
      files.map((file) => [file.fileType, file]),
    );

    const products = [
      this.productRepository.create({
        slug: 'aura-sofa',
        nameKa: 'Aura დივანი',
        nameEn: 'Aura Sofa',
        descriptionKa:
          'Aura დივანი Bowen-ის საკვანძო მოდელია, შექმნილი მშვიდი პროპორციებითა და მაღალი კომფორტით ყოველდღიური გამოყენებისთვის.',
        descriptionEn:
          'Aura Sofa is a flagship Bowen model built with calm proportions and elevated comfort for daily living.',
        collection: 'Essentials 2026',
        heroImage: '/static/images/product-aura-sofa.svg',
        visibility: Visibility.PUBLIC,
        categories: [categoryBySlug['sofas-indoor']],
        designers: [designerBySlug['nino-meskhi']],
        files: [fileByType['technical_pdf']],
      }),
      this.productRepository.create({
        slug: 'brisa-armchair',
        nameKa: 'Brisa სავარძელი',
        nameEn: 'Brisa Armchair',
        descriptionKa:
          'Brisa სავარძელი ინტერიერში ქმნის რბილ აქცენტს და უხდება როგორც საცხოვრებელ, ისე სასტუმრო სივრცეებს.',
        descriptionEn:
          'Brisa Armchair adds a soft accent to interiors and suits both residential and hospitality spaces.',
        collection: 'Essentials 2026',
        heroImage: '/static/images/product-brisa-armchair.svg',
        visibility: Visibility.PUBLIC,
        categories: [categoryBySlug['armchairs-indoor']],
        designers: [designerBySlug['giorgi-kapanadze']],
        files: [fileByType['technical_pdf']],
      }),
      this.productRepository.create({
        slug: 'luma-table',
        nameKa: 'Luma მაგიდა',
        nameEn: 'Luma Table',
        descriptionKa:
          'Luma მაგიდა აერთიანებს თბილ მასალებსა და მკაფიო არქიტექტურულ ხაზებს, რაც მას მრავალფუნქციურს ხდის.',
        descriptionEn:
          'Luma Table combines warm materiality and clear architectural lines for versatile use.',
        collection: 'Signature 2026',
        heroImage: '/static/images/product-luma-table.svg',
        visibility: Visibility.PUBLIC,
        categories: [categoryBySlug['tables-writing-desks-indoor']],
        designers: [designerBySlug['salome-beridze']],
        files: [fileByType['technical_pdf']],
      }),
      this.productRepository.create({
        slug: 'marea-sunlounger',
        nameKa: 'Marea შეზლონგი',
        nameEn: 'Marea Sunlounger',
        descriptionKa:
          'Marea შეზლონგი შექმნილია შიდა ეზოებისა და ტერასებისთვის, გამძლე მასალებითა და მსუბუქი კონსტრუქციით.',
        descriptionEn:
          'Marea Sunlounger is built for courtyards and terraces with durable materials and lightweight construction.',
        collection: 'Outdoor 2026',
        heroImage: '/static/images/product-marea-sunlounger.svg',
        visibility: Visibility.PUBLIC,
        categories: [categoryBySlug['sunloungers-outdoor']],
        designers: [designerBySlug['nino-meskhi']],
        files: [fileByType['technical_pdf']],
      }),
    ];

    await this.productRepository.save(products);
    this.logger.log('Seeded products.');
  }

  private async seedCatalogues() {
    const count = await this.catalogueRepository.count();
    if (count > 0) {
      return;
    }

    const files = await this.fileRepository.find();
    const fileByTitle = Object.fromEntries(
      files.map((file) => [file.titleEn, file]),
    );

    const catalogues = [
      this.catalogueRepository.create({
        titleKa: 'Bowen Living 2026',
        titleEn: 'Bowen Living 2026',
        type: 'living',
        year: 2026,
        coverImage: '/static/images/catalogue-living.svg',
        visibility: Visibility.PUBLIC,
        pdfFile: fileByTitle['Bowen Living Catalogue 2026'],
      }),
      this.catalogueRepository.create({
        titleKa: 'Bowen Outdoor 2026',
        titleEn: 'Bowen Outdoor 2026',
        type: 'outdoor',
        year: 2026,
        coverImage: '/static/images/catalogue-outdoor.svg',
        visibility: Visibility.DEALER_ARCHITECT,
        pdfFile: fileByTitle['Bowen Outdoor Catalogue 2026'],
      }),
    ];

    await this.catalogueRepository.save(catalogues);
    this.logger.log('Seeded catalogues.');
  }

  private async seedNews() {
    const count = await this.newsRepository.count();
    if (count > 0) {
      return;
    }

    const today = new Date();

    const posts = [
      this.newsRepository.create({
        slug: 'bowen-new-showroom-tbilisi',
        titleKa: 'Bowen-ის ახალი შოურუმი თბილისში',
        titleEn: 'Bowen Opens a New Showroom in Tbilisi',
        excerptKa:
          'Bowen-მა გახსნა ახალი შოურუმი ვაკეში, სადაც წარმოდგენილია 2026 წლის ძირითადი კოლექციები.',
        excerptEn:
          'Bowen opened a new showroom in Vake featuring the core 2026 collections.',
        contentKa:
          'ახალი სივრცე აერთიანებს საცხოვრებელი და გარე ავეჯის ექსპოზიციებს. სტუმრებს შეუძლიათ ადგილზე მიიღონ მასალების კონსულტაცია.',
        contentEn:
          'The new space combines indoor and outdoor furniture exhibitions. Visitors can receive material consultations on site.',
        category: 'stores',
        heroImage: '/static/images/news-showroom.svg',
        published: true,
        publishedAt: today,
      }),
      this.newsRepository.create({
        slug: 'bowen-architect-material-library',
        titleKa: 'არქიტექტორებისთვის მასალების ახალი ბიბლიოთეკა',
        titleEn: 'New Material Library for Architects',
        excerptKa:
          'არქიტექტორებს უკვე შეუძლიათ Bowen-ის მასალების კოლექციაზე წვდომა ავტორიზებული ანგარიშით.',
        excerptEn:
          'Architects can now access Bowen material collections through approved accounts.',
        contentKa:
          'მასალების ბიბლიოთეკაში დამატებულია ტექსტურები, სპეციფიკაციები და სწრაფი ჩამოტვირთვის ფაილები.',
        contentEn:
          'The material library now includes textures, specifications, and quick-download files.',
        category: 'materials',
        heroImage: '/static/images/news-materials.svg',
        published: true,
        publishedAt: new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000),
      }),
      this.newsRepository.create({
        slug: 'bowen-press-area-update',
        titleKa: 'Press ზონის განახლება',
        titleEn: 'Press Area Update',
        excerptKa: 'პრესი იღებს ახალ მაღალი რეზოლუციის ფოტოების არქივს.',
        excerptEn:
          'Press users now get an updated high-resolution photo archive.',
        contentKa:
          'Press პროფილებს დაემატა ახალი ფოტოკოლექციები პროდუქტების, შოურუმებისა და ბრენდ კამპანიების შესახებ.',
        contentEn:
          'Press profiles now include new photo collections for products, showrooms, and brand campaigns.',
        category: 'press',
        heroImage: '/static/images/news-press.svg',
        published: true,
        publishedAt: new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000),
      }),
    ];

    await this.newsRepository.save(posts);
    this.logger.log('Seeded news posts.');
  }
}
