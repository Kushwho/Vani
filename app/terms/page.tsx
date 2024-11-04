import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "../components/Header";
import Footer from "../components/Footer";
import { sections } from "@/lib/data/terms";

const TermsAndConditions: React.FC = () => {
  return (
    <>
      <Navbar />
      <Card className="w-full max-w-7xl mx-auto bg-transparent border-none shadow-none min-h-[85vh] my-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center mb-8">
            Terms and Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-full pr-4">
            <div className="space-y-12">
              {sections.map((section, index) => (
                <section key={index} className="space-y-6">
                  <h2 className="text-2xl font-semibold border-b pb-2">
                    {section.title}
                  </h2>
                  <div className="space-y-6">
                    {section.content.map((item, itemIndex) => (
                      <div key={itemIndex} className="space-y-3">
                        {item.heading && (
                          <h3 className="text-lg font-medium text-gray-900">
                            {item.heading}
                          </h3>
                        )}
                        {item.text && (
                          <p className="text-base text-gray-600 leading-relaxed">
                            {item.text}
                          </p>
                        )}
                        {item.items && (
                          <ul className="list-disc pl-6 text-base text-gray-600 space-y-2">
                            {item.items.map((listItem, listItemIndex) => (
                              <li
                                key={listItemIndex}
                                className="leading-relaxed"
                              >
                                {listItem}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <Footer />
    </>
  );
};

export default TermsAndConditions;
