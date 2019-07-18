import { Version } from '@microsoft/sp-core-library';
<<<<<<< HEAD
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { IPropertyPaneConfiguration, PropertyPaneTextField } from "@microsoft/sp-property-pane";
=======
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

>>>>>>> c59e1cc1760989bda2a80feb1007bd69de523e15
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './PanthemaWebPart.module.scss';
import * as strings from 'PanthemaWebPartStrings';

import * as Handlebars from 'handlebars';


export interface IPanthemaWebPartProps {
  description: string;
}

export interface IColorInfo {
  color: string;
  usage: Array<string>;
}

export default class PanthemaWebPart extends BaseClientSideWebPart<IPanthemaWebPartProps> {

  // return all current theme colors
  private themeColors(): Array<IColorInfo> {


    const themeSlots = window['__themeState__'] !== undefined && window['__themeState__'].theme !== undefined ? window['__themeState__'].theme : {},
      themeSlotKeys = Object.keys(themeSlots);

    const colorBlocksValues = themeSlotKeys.map(key => {
      return themeSlots[key];
    });

    const colorUsage = colorBlocksValues.filter(
      (color, index, self) => {
        console.log(color);
        return self.indexOf(color) === index
          && color.indexOf('ms-font') === -1
          && color.indexOf('none') === -1;
      }
    ).map(
      colorValue => {
        console.log('Color USAGE::::');

        let usage = themeSlotKeys.filter(key => {
          return themeSlots[key] === colorValue;
        });

        return {
          color: colorValue,
          usage: usage,
          usagestring: usage.join(', ')
        };
      }
    );
    // .sort(
    //   (a, b) => {
    //     if (a.color > b.color) {
    //       return 1
    //     }
    //     if (a.color < b.color) {
    //       return -1
    //     }
    //     return 0;
    //   }
    // )

    console.log('themeSlotKeys', themeSlotKeys);
    console.log('colorValues', colorBlocksValues);
    console.log('colorUsage', colorUsage);

    return colorUsage;
  }

  public render(): void {

    // load and precompile template
    let PanthemaWebPartTemplate = <HandlebarsTemplateDelegate>require('./components/PanthemaWebPart.hbs');
    let PanthemaItem = <HandlebarsTemplateDelegate>require('./components/panthema-item.hbs');

    let data = {
      styles: styles,
      description: this.properties.description,
      colors: this.themeColors(),
      panthemaItem: PanthemaItem
    };

    console.log('PanthemaItems', PanthemaItem);

    this.domElement.innerHTML = PanthemaWebPartTemplate(data);

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
