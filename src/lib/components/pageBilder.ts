import { page } from "$app/stores";
import { get } from "svelte/store";

/**
 * The Builder interface specifies methods for creating the different parts of
 * the Product objects.
 */
interface Builder {
    produceLanguages(inputList : string[]): void;
    produceYearStart(input : string): void;
    produceYearEnd(input : string): void;
    produceSetURL(url:URL): void;
}

/**
 * The Concrete Builder classes follow the Builder interface and provide
 * specific implementations of the building steps. Your program may have several
 * variations of Builders, implemented differently.
 */
export class PageCrafter implements Builder {
    private product: ProductURL;

    /**
     * A fresh builder instance should contain a blank product object, which is
     * used in further assembly.
     */
    constructor() {
        this.product = new ProductURL();
    }

    public reset(): void {
        this.product = new ProductURL();
    }

    /**
     * All production steps work with the same product instance.
     */
    public produceSetURL(url: URL): void {
        this.product.url = url
    }

    public produceLanguages(inputList : string[]): void {
        this.product.url?.searchParams.set('languages', inputList.join(','))
    }

    public produceYearStart(input : string): void {
        this.product.url?.searchParams.set('yearStart', input);
    }

    public produceYearEnd(input : string): void {
        this.product.url?.searchParams.set('yearEnd', input);
    }

    /**
     * Concrete Builders are supposed to provide their own methods for
     * retrieving results. That's because various types of builders may create
     * entirely different products that don't follow the same interface.
     * Therefore, such methods cannot be declared in the base Builder interface
     * (at least in a statically typed programming language).
     *
     * Usually, after returning the end result to the client, a builder instance
     * is expected to be ready to start producing another product. That's why
     * it's a usual practice to call the reset method at the end of the
     * `getProduct` method body. However, this behavior is not mandatory, and
     * you can make your builders wait for an explicit reset call from the
     * client code before disposing of the previous result.
     */
    public getProduct(): ProductURL {
        const result = this.product;
        this.reset();
        return result;
    }
}

/**
 * It makes sense to use the Builder pattern only when your products are quite
 * complex and require extensive configuration.
 *
 * Unlike in other creational patterns, different concrete builders can produce
 * unrelated products. In other words, results of various builders may not
 * always follow the same interface.
 */
class ProductURL {
    public url?: URL
    constructor()
    {
        this.url = undefined;
    }

    // public listParts(): void {
    //     console.log(`Product parts: ${this.parts.join(', ')}\n`);
    // }
}

/**
 * The Director is only responsible for executing the building steps in a
 * particular sequence. It is helpful when producing products according to a
 * specific order or configuration. Strictly speaking, the Director class is
 * optional, since the client can control builders directly.
 */
// class Director {
//     private builder: Builder;

//     /**
//      * The Director works with any builder instance that the client code passes
//      * to it. This way, the client code may alter the final type of the newly
//      * assembled product.
//      */
//     public setBuilder(builder: Builder): void {
//         this.builder = builder;
//     }

//     /**
//      * The Director can construct several product variations using the same
//      * building steps.
//      */
//     public buildMinimalViableProduct(): void {
//         this.builder.producePartA();
//     }

//     public buildFullFeaturedProduct(): void {
//         this.builder.producePartA();
//         this.builder.producePartB();
//         this.builder.producePartC();
//     }
// }